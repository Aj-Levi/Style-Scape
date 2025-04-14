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
      return Response.json(
        {
          success: false,
          message: "Invalid product or category ID",
        },
        { status: 400 }
      );
    }

    await ConnectDB();

    const product: ProductInterface | null = await Product.findOne({
      _id: productId,
      categoryId,
    });

    if (!product) {
      return Response.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    if (product?.reviews && product.reviews.length > 0) {
      await Product.populate(product, {
        path: "reviews.user",
        select: "firstname lastname email image",
      });
    }

    return Response.json({
      success: true,
      product,
    },{status: 200});
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch product details",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; productId: string }> }
) {
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
    const { productId, categoryId } = await params;
    const body = await request.json();

    if (!isValidObjectId(productId) || !isValidObjectId(categoryId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid product or category ID",
        },
        { status: 400 }
      );
    }

    await ConnectDB();

    const product = await Product.findOne({ _id: productId, categoryId });
    if (!product) {
      return Response.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
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
        return Response.json({success: false, message: "enter a valid category id"},{status: 400});
       }
    }

    const existingProduct: ProductInterface | null = await Product.findById(productId);
    if(!existingProduct) {
       return Response.json({success: false, message: "product not found"},{status: 404});
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
      isFeatured: isFeatured || existingProduct.isFeatured,
      isOnSale: isOnSale || existingProduct.isOnSale,
      sizes: sizes || existingProduct.sizes,
      metadesc: metadesc || existingProduct.metadesc,
      metakeywords: metakeywords || existingProduct.metakeywords,
      metatitle: metatitle || existingProduct.metatitle,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true }
    );

    return Response.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    },{status: 200});
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update product",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; productId: string }> }
) {
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
    const { productId, categoryId } = await params;

    if (!isValidObjectId(productId) || !isValidObjectId(categoryId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid product or category ID",
        },
        { status: 400 }
      );
    }

    await ConnectDB();

    const product = await Product.findOne({ _id: productId, categoryId });
    if (!product) {
      return Response.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(productId);

    return Response.json({
      success: true,
      message: "Product deleted successfully",
    },{status: 200});
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to delete product",
      },
      { status: 500 }
    );
  }
}
