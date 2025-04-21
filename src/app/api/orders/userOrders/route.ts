import { UserInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import { getSession } from "@/lib/getSession";
import User from "@/lib/models/User";
import { OrderSchema } from "@/lib/models/Order";
import mongoose from "mongoose";

export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("Active Session is required", { status: 400 });
  }

  try {
    await ConnectDB();

    if(!mongoose.models.Order) {
      mongoose.model("Order", OrderSchema);
    }

    const user: UserInterface | null = await User.findById(
      String(session.user.id)
    )
      .populate({
        path: "orders",
        model: "Order",
        populate: {
          path: "items.product",
          model: "Product",
        },
      })
      .exec();

    if (!user) {
      return Response.json("User not found", { status: 404 });
    }

    return user.orders
      ? Response.json(user.orders, { status: 200 })
      : Response.json([], { status: 200 });
      
  } catch (error) {
    console.log("Error in GET Orders: ", error);
    return Response.json("Internal Server Error", { status: 500 });
  }
}
