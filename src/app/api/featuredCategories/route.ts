import { CategoryInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import Category from "@/lib/models/Category";

export async function GET(_Request: Request) {
    try {
        await ConnectDB();
        const categories: CategoryInterface[] = await Category.find({isfeatured: true}).sort({createdAt: -1}).limit(10);
        return categories ? Response.json(categories, {status: 200}) : Response.json([], {status: 200});
    } catch (err) {
        return Response.json("Internal Server Error while getting the featured categories" ,{status: 500});
    }
}