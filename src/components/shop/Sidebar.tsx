"use client";
import React from "react";
import { useZustandStore } from "@/lib/stores/ZustandStore";

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useZustandStore();

  const closeSidebar = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    toggleSidebar();
  };

  return (
    <>
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 z-10 w-screen h-screen bg-black ${
          isSidebarOpen ? "opacity-50" : "hidden"
        } lg:hidden`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          closeSidebar(e);
        }}
      ></div>
      <div
        className={`w-[45vw] lg:w-[30vw] max-sm:w-screen fixed left-0 top-0 bottom-0 z-20 bg-base-100 transition-transform duration-700 rounded-r-xl ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        {/* content of the sidebar */}
        <div className="bg-base-300">
        </div>
      </div>
    </>
  );
};

export default Sidebar;
