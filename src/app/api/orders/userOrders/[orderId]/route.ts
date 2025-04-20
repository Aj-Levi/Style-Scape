import { OrderInterface, UserInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import { getSession } from "@/lib/getSession";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import { isValidObjectId } from "mongoose";

export async function GET(
  _Req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("Active Session is required", { status: 400 });
  }

  try {
    const { orderId } = await params;

    if (!isValidObjectId(String(orderId))) {
      return Response.json("invalid", { status: 200 });
    }

    const order: OrderInterface = await Order.findById(String(orderId))
      .populate({
        path: "customer",
        model: "User",
        select: "firstname lastname email image",
      })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .exec();

    if (!order) {
      return Response.json("Order not found", { status: 404 });
    }

    return Response.json(order, { status: 200 });
  } catch (error) {
    return Response.json("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  _Req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("Active Session is required", { status: 400 });
  }
  if (session.user.role === "user") {
    return Response.json("Access Denied", { status: 400 });
  }

  try {
    const { orderId } = await params;

    const order: OrderInterface | null = await Order.findById(String(orderId));

    if (!order) {
      return Response.json("Order not found", { status: 404 });
    }

    order.isDelivered = true;
    order.deliveredAt = String(Date.now());
    order.status = "Delivered";

    await order.save();

    return Response.json({ message: "Marked Delivered" }, { status: 200 });
  } catch (error) {
    return Response.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _Req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("Active Session is required", { status: 400 });
  }

  try {
    const { orderId } = await params;
    await ConnectDB();

    const order: OrderInterface | null = await Order.findById(String(orderId));

    if (!order) {
      return Response.json("Order not found", { status: 404 });
    }

    if (
      session.user.role === "admin" ||
      String(order.customer) === String(session.user.id)
    ) {
      const user: UserInterface | null = await User.findById(
        String(order.customer)
      );

      if (!user) {
        return Response.json("User does not exist", { status: 404 });
      }

      console.log(user.orders);

      user.orders = user.orders?.filter((id) => String(id) !== String(orderId));

      console.log("updated orders ----> ", user.orders);
      await user.save();

      await Order.findByIdAndDelete(String(orderId));

      return Response.json({ message: "deleted Sucessfully" }, { status: 200 });
    } else {
      return Response.json("Could not cancel the order", { status: 400 });
    }
  } catch (error) {
    return Response.json("Internal Server Error", { status: 500 });
  }
}
