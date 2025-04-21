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
    if(err instanceof Error) {
      return { success: false, message: "Invalid Credentials" };
    }else{
      return {success: false, message: "Unknown error occured"};
    }
  }
};

const registerUser = async (
  formdata: FormData
): Promise<{ success: boolean; message: string }> => {
  const firstname = formdata.get("firstname") as string;
  const lastname = formdata.get("lastname") as string;
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  try {
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
  
    return { success: true, message: "Registered Successfully" };

  } catch (err) {

    console.error("Could not register the User",err);
    return {success: false, message: "Could not register the User"};

  }
};

const providerLogin = async (
  provider: string
): Promise<{ success: boolean; message: string }> => {
  try {
    await signIn(provider);
  } catch (error) {
    console.error("Failed to sign in with " + provider, error);
    return { success: false, message: "Failed to sign in with " + provider };
  }
  return { success: true, message: "Logged In Successfully" };
};

export { registerUser, loginUser, providerLogin };
