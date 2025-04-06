"use server";
import { signIn } from "@/auth";
import ConnectDB from "@/lib/connectDB";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

const loginUser = async (
  formdata: FormData
): Promise<{ success: boolean; message: string }> => {
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  try {
    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email,
      password,
    });
    return { success: true, message: "Logged In Successfully" };
  } catch (err) {
    return { success: false, message: "unable to sign in" };
  }
};

const registerUser = async (
  formdata: FormData
): Promise<{ success: boolean; message: string }> => {
  const firstname = formdata.get("firstname") as string;
  const lastname = formdata.get("lastname") as string;
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  // connecting to DB
  await ConnectDB();

  // checking for existing user
  const existinguser = await User.findOne({ email });
  if (existinguser) {
    return { success: false, message: "This User Already Exists" };
  }

  // hashing the user password by adding salt to it
  const salt = await bcrypt.genSalt(12);
  const hashedpassword = await bcrypt.hash(password, salt);

  await User.create({ firstname, lastname, email, password: hashedpassword });
  console.log("------ User registered successfully ------");

  return { success: true, message: "Registered Successfully" };
};

export { registerUser, loginUser };
