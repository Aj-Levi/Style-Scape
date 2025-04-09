import ConnectDB from "@/lib/connectDB";
import User from "@/lib/models/User";
import { UserInterface } from "@/Interfaces";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await ConnectDB();
    const allusers: UserInterface[] = await User.find({});
    return allusers ? Response.json(allusers) : Response.json([]);
  } catch (err) {
    console.error("some error occured while getting all the users");
    return new Response("some error occured while getting all the users", {
      status: 500,
    });
  }
}

export async function POST(Req: Request) {
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
