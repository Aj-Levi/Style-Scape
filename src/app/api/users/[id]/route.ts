import { UpdatedUserInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import { getSession } from "@/lib/getSession";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function GET(
  _Req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const session = await getSession();
    if(!session?.user) {
      return Response.json("An active admin session is required", {status: 400});
    }

  try {
    const { id } = await params;

    await ConnectDB();
    const user = await User.findById(id);

    if(!user) {
      return Response.json("user does not exist", {status: 404});
    }

    return Response.json(user ,{status: 200});

  } catch (err) {
    console.error("Internal Server Error ",err);
    return Response.json("Internal Server Error", {
      status: 500,
    });
  }
}

export async function DELETE(
  _Req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const session = await getSession();
    if(!session?.user) {
      return Response.json("An active admin session is required", {status: 400});
    }

  try {
    const { id } = await params;

    await ConnectDB();

    await User.findByIdAndDelete(id);

    return Response.json({message: "User deleted successfully"}, { status: 200 });
  } catch (err) {
    console.error("some error occured while deleting the user ",err);
    return Response.json("some error occured while deleting the user", {
      status: 500,
    });
  }
}

export async function PATCH(
  Req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const session = await getSession();
    if(!session?.user) {
      return Response.json("An active admin session is required",{status: 400});
    }

  try {
    const { id } = await params;

    const body = await Req.json();
    await ConnectDB();
    const user = await User.findById(id);
    
    if (!user) {
      return Response.json("User not found", { status: 404 });
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

    return Response.json({message: "User updated successfully"}, { status: 200 });
  } catch (err) {
    console.error("some error occured while updating the user ", err);
    return Response.json("some error occured while updating the user", {
      status: 500,
    });
  }
}
