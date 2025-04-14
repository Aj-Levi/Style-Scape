import { ProductInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import Product from "@/lib/models/Product";

export async function GET(_Request: Request) {
    try {
        await ConnectDB();
        const products: ProductInterface[] | null = await Product.find({}).sort({createdAt: -1}).limit(10);

        return products ? Response.json(products) : Response.json([]);
    } catch (err) {
        console.error("Internal Server Error while getting the products on sale",err);
        return Response.json({success: false, message: "Internal Server Error while getting the products on sale"},{status: 500});
    }
}