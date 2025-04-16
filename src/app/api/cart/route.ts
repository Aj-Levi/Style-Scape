import ConnectDB from "@/lib/connectDB";
import { getSession } from "@/lib/getSession";
import User from "@/lib/models/User";

export async function GET(_request: Request) {
  const session = await getSession();
  if (!session?.user) {
      console.log("session not found");
    return Response.json(
      { success: false, message: "Active Session is required" },
      { status: 400 }
    );
  }

  const userId = session.user.id;

  try {
    await ConnectDB();
    const user = await User.findById(String(userId)).populate("cartitems.product");
    return Response.json(user.cartitems);
  } catch (err) {
    console.error("some error occurred while getting the cart items",err);
    return Response.json({success: false, message: "some error occurred while getting the cart items"},{status: 500})
  }

}
