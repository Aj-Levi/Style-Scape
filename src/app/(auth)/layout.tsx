import LoginImage from "@/components/auth/LoginImage";
import ThemeToggleFixed from "@/components/auth/ThemeToggleFixed";
import React, { ReactNode } from "react";

const LoginSignUpLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className="flex h-screen w-screen max-md:flex-col max-md:justify-center max-md:gap-y-8 bg-base-100">
      <ThemeToggleFixed />
      {/* Background Image */}
      <LoginImage />

      <div className="md:hidden flex w-full justify-center items-center text-3xl font-bold underline decoration-4 underline-offset-4">
        Style Scape
      </div>

      {/* Form Container */}
      { children }
    </div>
  );
};

export default LoginSignUpLayout;
