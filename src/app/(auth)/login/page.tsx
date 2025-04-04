"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from "react-icons/fa";
import { loginUser } from "@/actions/User";

const Login = () => {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="w-[55%] max-md:w-full flex items-center justify-center md:p-8 ">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-md bg-base-300 p-8 rounded-xl shadow-lg">
          <div className="text-center mb-2">
            <h1 className={`text-3xl font-bold`}>Welcome Back</h1>
            <p className={`text-base-content mt-2`}>
              Please sign in to your account
            </p>
          </div>

          <div className="flex flex-col space-y-4 mb-6">
            <form className="space-y-6 mt-6">
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
                <input type="email" name="email" placeholder="mail@site.com" required />
              </label>

              <label className="input validator relative w-full">
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
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                    <circle
                      cx="16.5"
                      cy="7.5"
                      r=".5"
                      fill="currentColor"
                    ></circle>
                  </g>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  name="password"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    setPassword(e.target.value)
                  }
                  required
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-base-content" />
                  ) : (
                    <FaEye className="text-base-content" />
                  )}
                </button>
              </label>

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

            <form>
              <button
                type="submit"
                className="flex items-center justify-center w-full btn btn-primary"
              >
                <FaGoogle className="mr-2" size={18} />
                <span className="font-medium">Sign in with Google</span>
              </button>
            </form>

            <form>
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
