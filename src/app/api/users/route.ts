import ConnectDB from "@/lib/connectDB";
import User from "@/lib/models/User";
import { UserInterface } from "@/Interfaces";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/getSession";

export async function GET() {

  const session = await getSession();
  if(!session?.user) {
    return Response.json("An active admin session is required", {status: 400});
  }

  if(session.user.role === "user") {
    return Response.json("Access denied", {status: 400});
  }

  try {
    await ConnectDB();
    const allusers: UserInterface[] = await User.find({});
    return allusers ? Response.json(allusers, {status: 200}) : Response.json([], {status: 200});
  } catch (err) {
    console.error("Error in GET Users: ", err);
    console.error("some error occured while getting all the users");
    return Response.json("some error occured while getting all the users", {
      status: 500,
    });
  }
}

export async function POST(Req: Request) {

  const session = await getSession();
  if(!session?.user) {
    return Response.json("An active admin session is required", {status: 400});
  }

  if(session.user.role === "user") {
    return Response.json("Access denied", {status: 400});
  }

  const body = await Req.json();
  const {email, password, firstname, lastname, role} = body;

  await ConnectDB();

  const existinguser = await User.findOne({ email });
  if (existinguser) {
    return Response.json("This User Already Exists", {status: 400});
  }

  const salt = await bcrypt.genSalt(12);
  const hashedpassword = await bcrypt.hash(password, salt);

  await User.create({ firstname, lastname, email, password: hashedpassword, role });

  return Response.json({ message: "Registered Successfully"}, {status: 200});
}
