import ConnectDB from "@/lib/connectDB";
import User from "@/lib/models/User";

export async function GET(
  _Req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ConnectDB();
    const user = await User.findOne({ _id: id });
    return Response.json(user);
  } catch (err) {
    console.error("some error occured while deleting the user");
    return new Response("some error occured while deleting the user", {
      status: 404,
    });
  }
}

export async function DELETE(
  _Req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ConnectDB();
    await User.deleteOne({ $and: [{ _id: id }, { role: "user" }] });
    return new Response("User deleted successfully", { status: 200 });
  } catch (err) {
    console.error("some error occured while deleting the user");
    return new Response("some error occured while deleting the user", {
      status: 404,
    });
  }
}

export async function PATCH(
  Req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await Req.json();
    await ConnectDB();
    const user = await User.findOne({ _id: id });
    await User.updateOne(
      { _id: id },
      {
        $set: {
          firstname: body?.firstname || user?.firstname,
          lastname: body?.lastname || user?.lastname,
          image: body?.image || user?.image,
        },
      }
    );
    return new Response("User updated successfully", { status: 200 });
  } catch (err) {
    console.error("some error occured while deleting the user");
    return new Response("some error occured while deleting the user", {
      status: 404,
    });
  }
}
