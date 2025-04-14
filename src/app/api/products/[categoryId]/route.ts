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
        return Response.json({
            success: false,
            message: "please enter a valid category id",
        },{status: 400});
    }
        
    await ConnectDB();
    
    const products: ProductInterface[] = await Product.find({ 
      categoryId 
    });
    
    return Response.json({ 
      success: true, 
      products: products || [],
      count: products.length
    },{status: 200});
    
  } catch (error) {
    console.error("Error getting products by category ID:", error);
    return Response.json({ 
      success: false, 
      message: "Failed to fetch products for this category" 
    }, { status: 500 });
  }
}