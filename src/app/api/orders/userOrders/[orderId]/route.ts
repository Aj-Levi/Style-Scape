import { OrderInterface } from "@/Interfaces";
import { getSession } from "@/lib/getSession";
import Order from "@/lib/models/Order";

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

    const order: OrderInterface | null = await Order.findById(
      String(orderId)
    )
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

    if (!order) {
      return Response.json("Order not found", { status: 404 });
    }

    return Response.json(order, { status: 200 });
  } catch (error) {
    return Response.json("Internal Server Error", { status: 500 });
  }
}
