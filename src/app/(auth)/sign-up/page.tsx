"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="w-[55%] max-md:w-full flex items-center justify-center md:p-8 ">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-md bg-base-300 p-8 rounded-xl shadow-lg">
          <div className="text-center mb-2">
            <h1 className={`text-3xl font-bold`}>Create an Account</h1>
            <p className={`text-base-content mt-2`}>
              Sign up to get started
            </p>
          </div>

          <div className="flex flex-col space-y-4 mb-6">
            <form className="space-y-4 mt-6">
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
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </g>
                </svg>
                <input
                  type="input"
                  name="username"
                  required
                  placeholder="Username"
                  className="text-md"
                />
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>):void => setPassword(e.target.value)}
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

              <button type="submit" className="w-full btn btn-primary">
                Sign Up
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-base-content">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
