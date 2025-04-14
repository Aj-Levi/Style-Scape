import ConnectDB from "@/lib/connectDB";
import User from "@/lib/models/User";
import { UserInterface } from "@/Interfaces";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/getSession";

export async function GET() {

  const session = await getSession();
  if(!session?.user) {
    return Response.json({success: false, message: "an active admin session is required"},{status: 500});
  }

  if(session.user.role === "user") {
    return Response.json({success: false, message: "access denied"},{status: 500});
  }

  try {
    await ConnectDB();
    const allusers: UserInterface[] = await User.find({});
    return allusers ? Response.json(allusers) : Response.json([]);
  } catch (err) {
    console.error("some error occured while getting all the users");
    return Response.json({success: false, message:"some error occured while getting all the users"}, {
      status: 500,
    });
  }
}

export async function POST(Req: Request) {

  const session = await getSession();
  if(!session?.user) {
    return Response.json({success: false, message: "an active admin session is required"},{status: 500});
  }

  if(session.user.role === "user") {
    return Response.json({success: false, message: "access denied"},{status: 500});
  }

  const body = await Req.json();
  const {email, password, firstname, lastname, role} = body;

  await ConnectDB();

  const existinguser = await User.findOne({ email });
  if (existinguser) {
    return Response.json({ success: false, message: "This User Already Exists" });
  }

  const salt = await bcrypt.genSalt(12);
  const hashedpassword = await bcrypt.hash(password, salt);

  await User.create({ firstname, lastname, email, password: hashedpassword, role });
  console.log("------ User registered successfully ------");

  return Response.json({ success: true, message: "Registered Successfully" });
}
