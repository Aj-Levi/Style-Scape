"use client"
import React from "react";
import { useZustandStore } from "@/lib/stores/ZustandStore";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggleLogin = () => {
  let { currentTheme , toggleTheme } = useZustandStore();

  return (
    <button 
      className="btn btn-secondary font-semibold fixed top-4 right-4" 
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {currentTheme === "synthwave" ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggleLogin;
