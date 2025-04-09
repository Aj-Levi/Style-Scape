"use client";

import React from "react";
import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { loginUser } from "@/actions/User";
import ShowHidePassword from "@/components/auth/ShowHidePassword";
import { toast, ToastContainer } from "react-toastify";
import ToastStyles from "@/styles/ToastStyles";
import { useRouter } from "next/navigation";
import AuthProvider from "@/components/auth/AuthProvider";
import EmailInput from "@/components/auth/EmailInput";

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

              <EmailInput />
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

            <AuthProvider provider="google" icon={<FaGoogle className="mr-2" size={18} />} />
            <AuthProvider provider="github" icon={<FaGithub className="mr-2" size={18} />} />
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
