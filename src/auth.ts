import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import ConnectDB from "./lib/connectDB";
import User from "./lib/models/User";
import { compare } from "bcryptjs";
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JWT } from "next-auth/jwt";

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
    };
  }

  interface User {
    id?: string;
    role?: string;
    firstname?: string;
    lastname?: string;
    image?: string | null;
    createdAt?: Date | string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    firstname?: string;
    lastname?: string;
    image?: string | null;
    createdAt?: Date | string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google({
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
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
          throw new Error("User Does not Exist");
        }

        const ismatched = await compare(password, user.password);

        if (!ismatched) {
          throw new Error("password did not match");
        }

        const userdata = {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          image: user.image,
          id: user._id,
          createdAt: user.createdAt,
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
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.image = user.image;
        token.createdAt = user.createdAt;
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
            const newuser = await User.create({
              email,
              firstname,
              lastname,
              image,
              authProviderId: id,
            });

            user.id = String(newuser._id);
            user.role = newuser.role;
            user.firstname = newuser.firstname;
            user.lastname = newuser.lastname;
            user.image = newuser.image;
            user.createdAt = newuser.createdAt;

          }

          user.id = String(alreadyUser._id);
          user.role = alreadyUser.role;
          user.firstname = alreadyUser.firstname;
          user.lastname = alreadyUser.lastname;
          user.image = alreadyUser.image;
          user.createdAt = alreadyUser.createdAt;

          return true;

        } catch (error) {
          console.error("Auth Provider Error ",error);
          throw new Error(
            "Error while creating new user using google or github"
          );
        }
      }

      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
});
