import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import ConnectDB from "./lib/connectDB";
import User from "./lib/models/User";
import { compare } from "bcryptjs";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

// Extend the next-auth types
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      firstname?: string;
      lastname?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      createdAt?: Date | string;
      phone?: string;
      address?: string;
    };
  }

  interface User {
    id?: string;
    role?: string;
    firstname?: string;
    lastname?: string;
    image?: string | null;
    createdAt?: Date | string;
    phone?: string;
    address?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    firstname?: string;
    lastname?: string;
    image?: string | null;
    createdAt?: Date | string;
    phone?: string;
    address?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },

      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;

        await ConnectDB();

        const user = await User.findOne({ email }).select("+password +role");

        if (!user) {
          throw new Error("user does not exist");
        }

        const ismatched = await compare(password, user.password);

        if (!ismatched) {
          console.log("reached here !!");
          throw new Error("password did not match");
        }

        const userdata = {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          id: user._id,
          image: user.image,
          createdAt: user.createdAt,
          phone: user.phone,
          address: user.address,
        };

        return userdata;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.firstname = token.firstname;
        session.user.lastname = token.lastname;
        session.user.image = token.image;
        session.user.createdAt = token.createdAt;
        session.user.phone = token.phone;
        session.user.address = token.address;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.image = user.image;
        token.createdAt = user.createdAt;
        token.phone = user.phone;
        token.address = user.address;
      }
      return token;
    },

    signIn: async ({ user, account }) => {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const { email, name, image, id } = user;

          const firstname = name?.split(" ")[0] || "";
          const lastname = name?.split(" ").slice(1).join(" ") || "";

          await ConnectDB();
          const alreadyUser = await User.findOne({ email });

          if (!alreadyUser) {
            await User.create({
              email,
              firstname,
              lastname,
              image,
              authProviderId: id,
            });
          }
          return true;
        } catch (error) {
          throw new Error(
            "Error while creating new user using google or github"
          );
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
});
