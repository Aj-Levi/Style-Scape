"use server"

import { signIn } from "@/auth";
import ConnectDB from "@/lib/connectDB";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

const loginUser = async(formdata: FormData): Promise<void> => {
    const email = formdata.get("email") as string;
    const password = formdata.get("password") as string;

    try {
        await signIn("credentials" , {
            redirect: false,
            callbackUrl: '/',
            email,
            password
        })
    } catch (err) {
        throw new Error("unable to sign in" + err);
    }
    redirect("/home");
}

const registerUser = async(formdata: FormData): Promise<void> => {
    const firstname = formdata.get('firstname') as string;
    const lastname = formdata.get('lastname') as string;
    const email = formdata.get('email') as string;
    const password = formdata.get('password') as string;

    // connecting to DB
    await ConnectDB();

    // checking for existing user
    const existinguser = await User.findOne({email});
    if(existinguser){
        throw new Error("User already exists");
    }

    // hashing the user password by adding salt to it
    const salt = await bcrypt.genSalt(12);
    const hashedpassword = await bcrypt.hash(password,salt);

    await User.create({firstname , lastname , email , password: hashedpassword});
    console.log("------ User registered successfully ------");

    redirect("/login");
}

export { registerUser , loginUser };