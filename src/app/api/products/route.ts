import { ProductInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import { getSession } from "@/lib/getSession";
import Product from "@/lib/models/Product";
import { isValidObjectId } from "mongoose";

export async function GET() {
  try {
    await ConnectDB();
    const allProducts: ProductInterface[] = await Product.find({});
    return allProducts ? Response.json(allProducts) : Response.json([]);
  } catch (err) {
    console.error("some error occured while getting all the Products");
    return new Response("some error occured while getting all the Products", {
      status: 500,
    });
  }
}

export async function POST(Req: Request) {
  
  const session = await getSession();
  if (!session?.user) {
    return Response.json(
      { success: false, message: "an active admin session is required" },
      { status: 500 }
    );
  }

  if (session.user.role === "user") {
    return Response.json(
      { success: false, message: "access denied" },
      { status: 500 }
    );
  }

  try {
    const body = await Req.json();
    const {
      name,
      description,
      price,
      salePrice,
      category,
      categoryId,
      stock,
      images,
      isFeatured,
      isOnSale,
      sizes,
      metatitle,
      metadesc,
      metakeywords,
    } = body;

    switch (true) {
      case !name:
        return Response.json({success: false,message: "product name is required"},{status: 400});
      case !price:
        return Response.json({success: false,message: "product price is required"},{status: 400});
      case !categoryId:
        if(!isValidObjectId(categoryId)) {
          return Response.json({success: false, message: "please enter a valid category id"},{status: 400});
        }
        return Response.json({success: false,message: "product categoryId is required"},{status: 400});

        case !stock:
          return Response.json({success: false,message: "product stock is required"},{status: 400});
    }

    await ConnectDB();

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return Response.json({
        success: false,
        message: "A product with this name already exists",
      },{status: 400});
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      salePrice,
      category,
      categoryId,
      stock,
      images,
      isFeatured,
      isOnSale,
      sizes,
      metatitle,
      metadesc,
      metakeywords,
      rating: 0,
      reviews: [],
    });

    console.log("------ Product added successfully ------");

    return Response.json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return new Response("Error adding product", {
      status: 500,
    });
  }
}
