import { ProductInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import Product from "@/lib/models/Product";

export async function GET(_Request: Request) {
    try {
        await ConnectDB();
        const products: ProductInterface[] = await Product.find({}).sort({createdAt: -1}).limit(10);
        return products ? Response.json(products, {status: 200}) : Response.json([], {status: 200});
    } catch (err) {
        return Response.json("Internal Server Error while getting the products on sale", {status: 500});
    }
}