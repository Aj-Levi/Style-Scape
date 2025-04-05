import React from "react";
import Image from "next/image";
import LoginBgImage from "../public/images/LoginBG.png";

const LoginImage = () => {
  return (
    <div className="max-md:hidden w-[45%] rounded-r-2xl overflow-clip relative">
      <Image
        src={LoginBgImage}
        alt="Fashion Login"
        className="h-full w-full object-cover" // Added blur filter
        priority
      />
      {/* Company name and punch line overlay with glassmorphism */}
      <div className="max-md:hidden absolute inset-0 flex flex-col items-center justify-center">
        <div className="backdrop-blur-md bg-white/20 p-8 rounded-xl shadow-lg border border-white/30 max-w-xs w-full">
          <div className="text-center">
            <h1 className={`text-4xl font-bold mb-3 text-white`}>Style Scape</h1>
            <div className="w-16 h-1 bg-white/70 mx-auto mb-3 rounded-full"></div>
            <p className={`text-xl font-medium text-white`}>
              Elevate Your Fashion Journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginImage;
