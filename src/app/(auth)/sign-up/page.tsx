"use client";

import Link from "next/link";
import { registerUser } from "@/actions/User";
import ShowHidePassword from "@/components/auth/ShowHidePassword";
import ValidateInput from "@/components/auth/ValidateInput";
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
            <h1 className={`text-3xl font-bold`}>Create an Account</h1>
            <p className={`text-base-content mt-2`}>Sign up to get started</p>
          </div>

          <div className="flex flex-col space-y-4 mb-6">
            <form
              action={async(formdata: FormData): Promise<void> => {
                const response = await registerUser(formdata);
                if(response.success) {
                  toast.success(response.message, ToastStyles);
                  await new Promise(resolve=>{
                    setTimeout(() => {
                      resolve("toast shown");
                    }, 2000);
                  })
                  router.push("/login");
                }else{
                  toast.warn(response.message, ToastStyles);
                };
              }}
              className="space-y-4 mt-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
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
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <input
                    type="text"
                    placeholder="First Name"
                    name="firstname"
                    required
                  />
                </label>

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
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <input type="text" placeholder="Last Name" name="lastname" />
                </label>
              </div>
              
              <ValidateInput />
              <ShowHidePassword />

              <button
                type="submit"
                className="w-full btn btn-primary"
              >
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
