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
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
  
  interface User {
    id?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
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
          alert("user does not exist");
          return null;
        }

        const ismatched = compare(password, user.password);

        if (!ismatched) {
          alert("password did not match");
          return null;
        }

        const userdata = {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          id: user._id,
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
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    signIn: async ({ user, account }) => {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const { email, name, image, id } = user;
          await ConnectDB();
          const alreadyUser = await User.findOne({ email });

          if (!alreadyUser) {
            await User.create({ email, name, image, authProviderId: id });
          } else {
            return true;
          }
        } catch (error) {
          throw new Error("Error while creating new user using google or github");
        }
      }

      if (account?.provider === "credentials") {
        return true;
      } else {
        return false;
      }
    },
  },
});
