"use client";
import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useZustandStore } from "@/lib/stores/ZustandStore";

const ThemeToggle = () => {
    const { currentTheme, toggleTheme } = useZustandStore();
  return (
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
  );
};

export default ThemeToggle;
