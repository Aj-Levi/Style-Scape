"use client";
import React from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { RiAccountCircleLine } from "react-icons/ri";
import { useZustandStore } from "@/lib/stores/ZustandStore";
import { FiSun, FiMoon } from "react-icons/fi";

const NavbarIcons = () => {
  let { currentTheme, toggleTheme } = useZustandStore();
  return (
    <div className="flex items-center gap-x-2 *:cursor-pointer">
      <button className="btn btn-primary max-md:p-2">
        <HiOutlineShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      <button className="btn btn-primary max-md:p-2">
        <RiAccountCircleLine className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      <button
        className="font-semibold btn btn-secondary max-md:p-2"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {currentTheme === "synthwave" ? (
          <FiSun className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <FiMoon className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </button>
    </div>
  );
};

export default NavbarIcons;
