"use client";
import { providerLogin } from "@/actions/User";
import ToastStyles from "@/styles/ToastStyles";
import React, { ReactNode } from "react";
import { toast } from "react-toastify";

const AuthProvider = ({ provider, icon }: { provider: string, icon: ReactNode }) => {
  return (
    <form
      action={async () => {
        const response = await providerLogin(provider);
        if(response.success) {
          toast.success(response.message, ToastStyles);
        } else {
          toast.error(response.message, ToastStyles);
        }
      }}
    >
      <button
        type="submit"
        className="flex items-center justify-center w-full btn btn-primary"
      >
        {icon}
        <span className="font-medium">Sign in with {provider}</span>
      </button>
    </form>
  );
};

export default AuthProvider;
