import ConnectDB from "@/lib/connectDB";
import { getSession } from "@/lib/getSession";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import { isValidObjectId } from "mongoose";
import { ProductInterface, UserInterface } from "@/Interfaces";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("Active Session is required", { status: 400 });
  }

  try {
    const userId = session.user.id;
    const { id: Product_Id } = await params;
    const body = await  request.json();

    const {size} = body;

    if (!isValidObjectId(Product_Id)) {
      return Response.json("Invalid product ID", { status: 400 });
    }

    await ConnectDB();

    const product: ProductInterface | null = await Product.findById(Product_Id);
    if (!product) {
      return Response.json("Product not found", { status: 404 });
    }

    const user: UserInterface | null = await User.findById(String(userId));
    if (!user) {
      return Response.json("User not found", { status: 404 });
    }

    if (!user.cartitems || user.cartitems.length === 0) {
      user.cartitems = [];
    }

    // Checking if product already in cart
    let productFound = false;

    if (user.cartitems && user.cartitems.length > 0) {
      for (let item of user.cartitems) {
        if (String(item.product) === Product_Id && item.size === size) {
          item.quantity += 1;
          product.salePrice
            ? (item.totalProductPrice! += product.salePrice)
            : (item.totalProductPrice! += product.price);
          productFound = true;
          break;
        }
      }
    }

    if (!productFound) {
      user.cartitems.push({
        product: Product_Id,
        quantity: 1,
        size,
        totalProductPrice: product.salePrice || product.price,
      });
    }

    await user.save();

    return Response.json(
      {
        message: "Product added to cart successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json("Failed to add product to cart", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("Active Session is required", { status: 400 });
  }

  try {
    const userId = session.user.id;
    const { id: Product_Id } = await params;

    const body = await request.json();
    const {size} = body;

    await ConnectDB();

    const user: UserInterface | null = await User.findById(String(userId));
    if (!user || !user.cartitems || user.cartitems.length === 0) {
      return Response.json("Cart not found", { status: 404 });
    }

    // Finding product in cart
    let itemIndex = user.cartitems.findIndex(
      (item) => (String(item.product) === Product_Id && item.size === size)
    );

    if (itemIndex === -1) {
      return Response.json("Product not in cart", { status: 404 });
    }

    if (user.cartitems[itemIndex].quantity > 1) {
      user.cartitems[itemIndex].quantity -= 1;
    } else {
      user.cartitems.splice(itemIndex, 1);
    }

    await user.save();

    return Response.json({message: "Cart updated successfully"},{ status: 200 }
    );
  } catch (error) {
    return Response.json("Failed to update cart", { status: 500 });
  }
}
