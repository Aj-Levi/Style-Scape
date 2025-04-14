import { ProductInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import Product from "@/lib/models/Product";

export async function GET(_Request: Request) {
    try {
        await ConnectDB();
        const products: ProductInterface[] | null = await Product.find({isFeatured: true}).sort({createdAt: -1}).limit(10);

        return products ? Response.json(products) : Response.json([]);
    } catch (err) {
        console.error("Internal Server Error while getting the featured products",err);
        return Response.json({success: false, message: "Internal Server Error while getting the featured products"},{status: 500});
    }
}