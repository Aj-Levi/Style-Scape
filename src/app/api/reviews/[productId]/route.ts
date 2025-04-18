import { ProductInterface, ReviewInterface } from "@/Interfaces";
import { getSession } from "@/lib/getSession";
import Product from "@/lib/models/Product";
import Review from "@/lib/models/Review";
import { isValidObjectId } from "mongoose";

export async function GET(_Req: Request,{
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  try {
    const { productId } = await params;

    if (!isValidObjectId(String(productId))) {
      return Response.json("Invalid Product Id", { status: 400 });
    }

    const product: ProductInterface | null = await Product.findById(
      String(productId)
    )
      .populate({
        path: "reviews",
        model: "Review",
        populate: {
          path: "user",
          model: "User",
          select: "firstname lastname email image",
        },
      })
      .exec();

    if (!product) {
      return Response.json("Product not found", { status: 404 });
    }

    if (!product.reviews || product.reviews.length === 0) {
      return Response.json([], {status: 200});
    }

    return Response.json(product.reviews, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("Active Session is required", { status: 400 });
  }

  try {
    const { productId } = await params;
    const body = await request.json();
    const { rating, comment } = body;

    const product: ProductInterface | null = await Product.findById(productId);

    if (!product) {
      return Response.json("Product not found", { status: 404 });
    }

    const newReview = await Review.create({
      user: String(session.user?.id),
      rating,
      comment,
    });

    if (!product.reviews || product.reviews.length === 0) {
      product.reviews = [];
    }

    product.rating = ((product.rating * product.reviews.length) + rating) / (product.reviews.length + 1);

    product.reviews.push(String(newReview._id));

    await product.save();

    return Response.json(
      { message: "Review Added Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("Active Session is required", { status: 400 });
  }

  try {
    const { productId } = await params;
    const body = await request.json();
    const { rating, comment, reviewId } = body;

    const product: ProductInterface | null = await Product.findById(
      String(productId)
    );
    const review: ReviewInterface | null = await Review.findById(
      String(reviewId)
    );

    if (!product) {
      return Response.json("Product not found", { status: 404 });
    }

    if (!review) {
      return Response.json("Review not found", { status: 404 });
    }

    product.rating = ((product.rating * product.reviews!.length) - review.rating + rating) / (product.reviews!.length);

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();
    await product.save();

    return Response.json({ message: "Updated Successfully" }, { status: 200 });
  } catch (error) {
    return Response.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("Active Session is required", { status: 400 });
  }

  try {
    const { productId } = await params;
    const body = await request.json();
    const { reviewId } = body;

    const product: ProductInterface | null = await Product.findById(
      String(productId)
    );
    const review: ReviewInterface | null = await Review.findById(
      String(reviewId)
    );

    if (!product) {
      return Response.json("Product not found", { status: 404 });
    }

    if (!review) {
      return Response.json("Review not found", { status: 404 });
    }

    product.rating = ((product.rating * product.reviews!.length) - review.rating) / (product.reviews!.length - 1);

    product.reviews = product.reviews?.filter(
      (revid) => String(revid) !== reviewId
    );
    await Review.findByIdAndDelete(String(reviewId));

    await product.save();

    return Response.json({ message: "Deleted Successfully" }, { status: 200 });
  } catch (error) {
    return Response.json("Internal Server Error", { status: 500 });
  }
}
