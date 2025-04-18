import { ProductInterface, ReviewInterface, UserInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import { getSession } from "@/lib/getSession";
import Product from "@/lib/models/Product";
import { isValidObjectId } from "mongoose";

export async function GET(_Req: Request,{
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("Active Session is required", { status: 400 });
  }

  try {
    const { productId } = await params;
    const userId = session.user?.id;

    if (
      !isValidObjectId(String(productId)) ||
      !isValidObjectId(String(userId))
    ) {
      return Response.json("Invalid Product or User Id", { status: 400 });
    }

    await ConnectDB();

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
      return Response.json([], { status: 200 });
    }

    const UserReviews: ReviewInterface[] = (
      product.reviews as ReviewInterface[]
    ).filter((review) => String((review.user as UserInterface)._id) === userId);

    if (!UserReviews || UserReviews.length === 0) {
      return Response.json([], { status: 200 });
    }

    return Response.json(UserReviews, { status: 200 });
  } catch (error) {
    return Response.json("Internal Server Error", { status: 500 });
  }
}
