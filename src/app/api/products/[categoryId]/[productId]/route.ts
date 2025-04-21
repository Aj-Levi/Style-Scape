import { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import ConnectDB from "@/lib/connectDB";
import Product from "@/lib/models/Product";
import { ProductInterface, UpdatedProductInterface } from "@/Interfaces";
import { getSession } from "@/lib/getSession";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; productId: string }> }
) {
  try {
    const { productId, categoryId } = await params;

    if (!isValidObjectId(productId) || !isValidObjectId(categoryId)) {
      return Response.json("Invalid product or category ID", { status: 400 });
    }

    await ConnectDB();

    const product = await Product.findById(productId);

    if (!product) {
      return Response.json("Product not found", { status: 404 });
    }

    return Response.json(product, { status: 200 });
  } catch (error) {
    console.log("Error in GET Product: ", error);
    return Response.json("Failed to fetch product details", { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; productId: string }> }
) {
  const session = await getSession();
  if(!session?.user) {
    return Response.json("An active admin session is required", {status: 400});
  }

  if(session.user.role === "user") {
    return Response.json("Access denied", {status: 400});
  }

  try {
    const { productId, categoryId } = await params;
    const body = await request.json();

    if (!isValidObjectId(productId) || !isValidObjectId(categoryId)) {
      return Response.json("Invalid product or category ID", { status: 400 });
    }

    await ConnectDB();

    const product = await Product.findById(productId);
    if (!product) {
      return Response.json("Product not found", { status: 404 });
    }

    const {
      name,
      description,
      price,
      salePrice,
      category,
      categoryId: newCategoryId,
      stock,
      images,
      isFeatured,
      isOnSale,
      sizes,
      metatitle,
      metadesc,
      metakeywords,
    }: UpdatedProductInterface = body;

    if(newCategoryId) {
       if(!isValidObjectId(newCategoryId)) {
        return Response.json("enter a valid category id", {status: 400});
       }
    }

    const existingProduct: ProductInterface | null = await Product.findById(productId);
    if(!existingProduct) {
       return Response.json("product not found", {status: 404});
    }

    const updateData: UpdatedProductInterface = {
      name: name || existingProduct.name,
      description: description || existingProduct.description,
      price: price || existingProduct.price,
      salePrice: salePrice || existingProduct.salePrice,
      category: category || existingProduct.category,
      categoryId: newCategoryId || existingProduct.categoryId,
      stock: stock || existingProduct.stock,
      images: images || existingProduct.images,
      sizes: sizes || existingProduct.sizes,
      metadesc: metadesc || existingProduct.metadesc,
      metakeywords: metakeywords || existingProduct.metakeywords,
      metatitle: metatitle || existingProduct.metatitle,
    };

    if (isFeatured === true || isFeatured === false) {
      updateData.isFeatured = isFeatured;
    }

    if (isOnSale === true || isOnSale === false) {
      updateData.isOnSale = isOnSale;
    }

    await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true }
    );

    return Response.json({message: "Product Updated Successfully"}, {status: 200});
  } catch (error) {
    console.log("Error in PATCH Product: ", error);
    return Response.json("Failed to update product", { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; productId: string }> }
) {
  const session = await getSession();
  if(!session?.user) {
    return Response.json("An active admin session is required", {status: 400});
  }

  if(session.user.role === "user") {
    return Response.json("Access denied", {status: 400});
  }

  try {
    const { productId, categoryId } = await params;

    if (!isValidObjectId(productId) || !isValidObjectId(categoryId)) {
      return Response.json("Invalid product or category ID", { status: 400 });
    }

    await ConnectDB();

    await Product.findByIdAndDelete(productId);

    return Response.json({
      message: "Product deleted successfully",
    }, {status: 200});
  } catch (error) {
    console.log("Error in DELETE Product: ", error);
    return Response.json("Failed to delete product", { status: 500 });
  }
}
