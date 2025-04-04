"use server"

import { signIn } from "@/auth";
import ConnectDB from "@/lib/connectDB";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { CredentialsSignin } from "next-auth";

const loginUser = async(formdata: FormData) => {
    const email = formdata.get("email") as string;
    const password = formdata.get("password") as string;

    try {
        await signIn("credentials" , {
            redirectTo: '/',
            email,
            password
        })
    } catch (err) {
        const someError = err as CredentialsSignin
        return someError.cause;
    }
}

const registerUser = async(formdata: FormData) => {
    const firstname = formdata.get('firstname') as string;
    const lastname = formdata.get('lastname') as string;
    const email = formdata.get('email') as string;
    const password = formdata.get('password') as string;

    // connecting to DB
    await ConnectDB();

    // checking for existing user
    const existinguser = await User.findOne({email});
    if(existinguser){
        alert("user already exists");
        return;
    }

    // hashing the user password by adding salt to it
    const salt = await bcrypt.genSalt(12);
    const hashedpassword = await bcrypt.hash(password,salt);

    await User.create({firstname , lastname , email , password: hashedpassword});
    console.log("------ User registered successfully ------");
}

export { registerUser , loginUser };