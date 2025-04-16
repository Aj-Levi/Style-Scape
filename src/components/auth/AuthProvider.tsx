import { signIn } from "@/auth";
import ToastStyles from "@/styles/ToastStyles";
import React, { ReactNode } from "react";
import { toast } from "react-toastify";

const AuthProvider = ({ provider, icon }: { provider: string, icon: ReactNode }) => {
  return (
    <form
      action={async () => {
        try {
          await signIn(provider);
        } catch (error) {
          console.error("Failed to sign in with " + provider, error);
          toast.error("Failed to sign in with " + provider, ToastStyles);
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
