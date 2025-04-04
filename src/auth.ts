import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials"
import ConnectDB from "./lib/connectDB";
import User from "./lib/models/User";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {label: "email" , type: "email"},
        password: {label: "password" , type: "password"},
      },

      authorize: async(credentials)=>{
        const email = credentials.email as string;
        const password = credentials.password as string;

        await ConnectDB();

        const user = await User.findOne({email}).select("+password +role");

        if(!user){
          alert("user does not exist");
          return null;
        }

        const ismatched = compare(password,user.password);

        if(!ismatched){
          alert("password did not match");
          return null;
        }

        const userdata = {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          id: user._id,
        }

        return userdata;
      }
    })
  ],

  pages: {
    signIn: "/login",
  }

});
