import { ProductInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import { getSession } from "@/lib/getSession";
import Product from "@/lib/models/Product";
import { isValidObjectId } from "mongoose";

export async function GET() {
  try {
    await ConnectDB();
    const allProducts: ProductInterface[] = await Product.find({});
    return allProducts ? Response.json(allProducts, {status: 200}) : Response.json([], {status: 200});
  } catch (err) {
    return Response.json("some error occured while getting all the Products", {
      status: 500,
    });
  }
}

export async function POST(Req: Request) {
  const session = await getSession();
  if(!session?.user) {
    return Response.json("An active admin session is required", {status: 400});
  }

  if(session.user.role === "user") {
    return Response.json("Access denied", {status: 400});
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
      isFeatured,
      isOnSale,
      sizes,
      metatitle,
      metadesc,
      metakeywords,
    } = body;

    switch (true) {
      case !name:
        return Response.json("product name is required", {status: 400});
      case !price:
        return Response.json("product price is required", {status: 400});
      case !categoryId:
        return Response.json("product categoryId is required", {status: 400});
      case categoryId:
        if(!isValidObjectId(categoryId)) {
          return Response.json("please enter a valid category id", {status: 400});
        }
      case !stock:
        return Response.json("product stock is required", {status: 400});
    }

    await ConnectDB();

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return Response.json({
        success: false,
        message: "A product with this name already exists",
      },{status: 400});
    }

    await Product.create({
      name,
      description,
      price,
      salePrice,
      category,
      categoryId,
      stock,
      isFeatured,
      isOnSale,
      sizes,
      metatitle,
      metadesc,
      metakeywords,
      rating: 0,
      reviews: [],
    });

    return Response.json({
      message: "Product added successfully",
    }, {status: 200});
  } catch (error) {
    return Response.json("Error adding product", {
      status: 500,
    });
  }
}
