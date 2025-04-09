import { UpdatedUserInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function GET(
  _Req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await ConnectDB();

    const user = await User.findById(id);

    if(!user) {
      console.error("user does not exist");
      return new Response("user does not exist", {status: 500});
    }

    return Response.json(user);

  } catch (err) {
    console.error("some error occured while getting the user ",err);
    return new Response("some error occured while getting the user", {
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

    await User.findByIdAndDelete(id);

    return new Response("User deleted successfully", { status: 200 });
  } catch (err) {
    console.error("some error occured while deleting the user ",err);
    return new Response("some error occured while deleting the user", {
      status: 500,
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
    const user = await User.findById(id);
    
    if (!user) {
      return new Response("User not found", { status: 500 });
    }

    let hashedpassword: string | undefined;

    if (body?.password) {
      const salt = await bcrypt.genSalt(12);
      hashedpassword = await bcrypt.hash(body?.password, salt);
    }
    
    let updateData: UpdatedUserInterface = {
      firstname: body?.firstname || user.firstname,
      lastname: body?.lastname || user.lastname,
      phone: body?.phone || user.phone,
      address: body?.address || user.address,
      password: hashedpassword || user.password,
      role: body?.role || user.role,
    };
    
    // Only set image if it's a valid string value, not an empty object
    if (body?.image && typeof body.image === 'string') {
      updateData.image = body.image;
    } else if (user.image) {
      updateData.image = user.image;
    }
    
    await User.updateOne(
      { _id: id },
      { $set: updateData }
    );

    return new Response("User updated successfully", { status: 200 });
  } catch (err) {
    console.error("some error occured while updating the user ", err);
    return new Response("some error occured while updating the user", {
      status: 500,
    });
  }
}
