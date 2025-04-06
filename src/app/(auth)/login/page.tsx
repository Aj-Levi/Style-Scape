"use client";

import React from "react";
import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { loginUser } from "@/actions/User";
import { signIn } from "@/auth";
import ShowHidePassword from "@/components/auth/ShowHidePassword";
import { toast, ToastContainer } from "react-toastify";
import ToastStyles from "@/styles/ToastStyles";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  return (
    <div className="w-[55%] max-md:w-full flex items-center justify-center md:p-8 ">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="backdrop-blur-md bg-base-300 p-8 rounded-xl shadow-lg">
          <div className="text-center mb-2">
            <h1 className={`text-3xl font-bold`}>Welcome Back</h1>
            <p className={`text-base-content mt-2`}>
              Please sign in to your account
            </p>
          </div>

          <div className="flex flex-col space-y-4 mb-6">
            <form action={async(formdata: FormData): Promise<void> => {
              const response = await loginUser(formdata);
              if(response.success) {
                toast.success(response.message, ToastStyles);
                await new Promise(resolve=>{
                  setTimeout(() => {
                    resolve("toast shown");
                  }, 2000);
                })
                router.push("/home");
              }else{
                toast.error(response.message, ToastStyles);
              };
            }} className="space-y-6 mt-6">
              <label className="input validator w-full">
                <svg
                  className="h-[1em]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="mail@site.com"
                  required
                />
              </label>

              <ShowHidePassword />

              <button type="submit" className="w-full btn btn-secondary">
                Sign In
              </button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="flex-shrink mx-4 text-base-content text-sm">
                or
              </span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            <form
              action={async () => {
                try {
                  await signIn("google");
                } catch (error) {
                  toast.error("Failed to sign in with Google", ToastStyles);
                }
              }}
            >
              <button
                type="submit"
                className="flex items-center justify-center w-full btn btn-primary"
              >
                <FaGoogle className="mr-2" size={18} />
                <span className="font-medium">Sign in with Google</span>
              </button>
            </form>

            <form
              action={async () => {
                try {
                  await signIn("github");
                } catch (error) {
                  toast.error("Failed to sign in with GitHub", ToastStyles);
                }
              }}
            >
              <button
                type="submit"
                className="flex items-center justify-center w-full btn btn-primary"
              >
                <FaGithub className="mr-2" size={18} />
                <span className="font-medium">Sign in with GitHub</span>
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-base-content">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
