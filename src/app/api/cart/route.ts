import { UserInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import { getSession } from "@/lib/getSession";
import User from "@/lib/models/User";

export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("Active Session is required", { status: 400 });
  }

  try {
    const userId = session.user.id;

    await ConnectDB();

    const user: UserInterface | null = await User.findById(String(userId)).populate("cartitems.product").exec();
    if(!user) {
      return Response.json("User not found", {status: 404});
    }
    
    return Response.json(user, {status: 200});
  } catch (err) {
    console.error(err);
    return Response.json("some error occurred while getting the cart items", {status: 500})
  }
}
