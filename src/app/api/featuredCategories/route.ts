import { CategoryInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import Category from "@/lib/models/Category";

export async function GET(_Request: Request) {
    try {
        await ConnectDB();
        const categories: CategoryInterface[] | null = await Category.find({isfeatured: true}).sort({createdAt: -1}).limit(10);

        return categories ? Response.json(categories) : Response.json([]);
    } catch (err) {
        console.error("Internal Server Error while getting the featured categories",err);
        return Response.json({success: false, message: "Internal Server Error while getting the featured categories"},{status: 500});
    }
}