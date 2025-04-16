import { ProductInterface, ReviewInterface } from "@/Interfaces";
import { getSession } from "@/lib/getSession";
import Product from "@/lib/models/Product";
import Review from "@/lib/models/Review";
import { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";

export async function GET({params}: {params: Promise<{productId: string}>}) {
    try {
        const {productId} = await params;
    
        if(!isValidObjectId(String(productId))) {
            return Response.json("Invalid Product Id", {status: 400});
        }
    
        const product: ProductInterface | null = await Product.findById(String(productId)).populate("reviews").exec();
    
        if(!product || !product.reviews || product.reviews.length === 0) {
            return Response.json("No Reviews for this product", {status: 404});
        }
    
        return Response.json(product.reviews, {status: 200});

    } catch (error) {
        return Response.json("Internal Server Error", {status: 500});
    }
}

export async function POST(request: NextRequest, {params}: {params: Promise<{productId: string}>}) {
    const session = await getSession();
    if (!session?.user) {
      return Response.json("Active Session is required", { status: 400 });
    }

    try {
        const {productId} = await params;
        const body = await request.json();
        const {rating, comment} = body;

        const product: ProductInterface | null = await Product.findById(productId);

        if(!product) {
            return Response.json("Product not found", {status: 404});
        }

        const newReview = await Review.create({user: String(session.user?.id), rating, comment});

        if(!product.reviews || product.reviews.length === 0) {
            product.reviews = [];
        }

        product.reviews.push(String(newReview._id));
        return Response.json({message: "Review Added Successfully"}, {status: 200});

    } catch (error) {
        return Response.json("Internal Server Error", {status: 500});
    }
}

export async function PATCH(request: NextRequest, {params}: {params: Promise<{productId: string}>}) {
    const session = await getSession();
    if (!session?.user) {
      return Response.json("Active Session is required", { status: 400 });
    }

    try {
        const {productId} = await params;
        const body = await request.json();
        const {rating, comment, reviewId} = body;

        const product: ProductInterface | null = await Product.findById(String(productId));
        const review: ReviewInterface | null = await Review.findById(String(reviewId));

        if(!product) {
            return Response.json("Product not found", {status: 404});
        }

        if(!review) {
            return Response.json("Review not found", {status: 404});
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        await review.save();

        return Response.json({message: "Updated Successfully"}, {status: 200});
    } catch (error) {
        return Response.json("Internal Server Error", {status: 500});
    }
}

export async function DELETE(request: NextRequest, {params}: {params: Promise<{productId: string}>}) {
    const session = await getSession();
    if (!session?.user) {
      return Response.json("Active Session is required", { status: 400 });
    }

    try {
        const {productId} = await params;
        const body = await request.json();
        const {reviewId} = body;

        const product: ProductInterface | null = await Product.findById(String(productId));
        const review: ReviewInterface | null = await Review.findById(String(reviewId));

        if(!product) {
            return Response.json("Product not found", {status: 404});
        }

        if(!review) {
            return Response.json("Review not found", {status: 404});
        }

        product.reviews = product.reviews?.filter(revid => String(revid) !== reviewId)
        await Review.findByIdAndDelete(String(reviewId));

        await product.save();

        return Response.json({message: "Deleted Successfully"}, {status: 200});
    } catch (error) {
        return Response.json("Internal Server Error", {status: 500});
    }
}