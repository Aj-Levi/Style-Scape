import { ProductInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import Product from "@/lib/models/Product";
import { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    if(!isValidObjectId(categoryId)) {
        return Response.json("please enter a valid category id",
        {status: 400});
    }
        
    await ConnectDB();
    
    const products: ProductInterface[] = await Product.find({ 
      categoryId 
    });
    
    return products? Response.json(products, {status: 200}) : Response.json([], {status: 200});
    
  } catch (error) {
    return Response.json("Failed to fetch products for this category", { status: 500 });
  }
}