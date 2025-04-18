import { OrderItemInterface, UserInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import { getSession } from "@/lib/getSession";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";

export async function GET(_Req: Request) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("An active admin session is required", {
      status: 400,
    });
  }

  if (session.user.role === "user") {
    return Response.json("Access Denied", { status: 400 });
  }

  try {

    await ConnectDB();
    const orders = await Order.find({})
      .populate({
        path: "customer",
        model: "User",
        select: "firstname, lastname, email, image",
      })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .exec();

    return orders
      ? Response.json(orders, { status: 200 })
      : Response.json([], { status: 200 });
  } catch (error) {
    return Response.json("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("Active Session is required", { status: 400 });
  }

  try {
    const body = await request.json();
    const { contactNumber, shippingAddress, paymentMethod } = body;

    await ConnectDB();

    const user: UserInterface | null = await User.findById(
      String(session.user?.id)
    );

    if (!user) {
      return Response.json("User not found", { status: 404 });
    }

    if (!user.cartitems || user.cartitems.length === 0) {
      return Response.json("Cart is Empty", { status: 400 });
    }

    const orderItems: OrderItemInterface[] = user.cartitems;

    let totalOrderPrice: number = 0;
    for (let item of orderItems) {
      totalOrderPrice += item.totalProductPrice || 0;
    }

    const shippingPrice = totalOrderPrice > 4 ? 0 : 2.99;
    totalOrderPrice += shippingPrice;

    const newOrder = await Order.create({
      customer: session.user.id,
      items: orderItems,
      shippingPrice,
      paymentMethod,
      shippingAddress,
      contactNumber,
      totalOrderPrice,
    });

    if (!user.orders || user.orders.length === 0) {
      user.orders = [];
    }
    user.orders.push(String(newOrder._id));
    await user.save();

    return Response.json(
      { order_ID: String(newOrder._id) },
      { status: 200 }
    );
  } catch (error) {
    return Response.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("An active admin session is required", {
      status: 400,
    });
  }

  if (session.user.role === "user") {
    return Response.json("Access Denied", { status: 400 });
  }

  try {
    const body = await request.json();
    const {orderId} = body;

    await ConnectDB();

    const user: UserInterface | null = await User.findById(String(session.user.id));
    if(!user) {
        return Response.json("User not found", { status: 404 }); 
    }

    if(user.orders && user.orders.length !== 0) {
        user.orders = (user.orders).filter((orderid) => String(orderid) !== orderId);
    }

    await Order.deleteOne({_id: orderId});
    await user.save();

    return Response.json({message: "Order Deleted Successfully"}, {status: 200});
  } catch (error) {
    return Response.json("Internal Server Error", { status: 500 }); 
  }
}
