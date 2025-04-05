import Image from "next/image";
import React from "react";
import Logo from "@/public/HomeFavicon.png";
import NavbarIcons from "./NavbarIcons";
import SidebarMenuBtn from "./buttons/SidebarMenuBtn";

const Header = () => {
  return (
    <header className="flex flex-col w-screen border-b-2 bg-base-100">
      <div className="flex lg:w-[86%] lg:mx-auto py-4 lg:justify-between lg:items-center px-4 w-full justify-between items-center">
        <SidebarMenuBtn />
        <div className="flex items-center gap-x-8">
          <div className="flex items-center cursor-pointer gap-x-4">
            <div className="relative w-8 h-8 rounded-full">
              <Image
                src={Logo}
                alt="Logo"
                fill
                className="object-contain rounded-full"
              />
            </div>
            <div className="font-extrabold text-[1.5em] text-secondary">
              StyleScape
            </div>
          </div>
          <ul className="max-lg:hidden flex gap-x-[1.25rem] font-bold text-[1.1rem] *:flex *:items-center *:cursor-pointer">
            <li>Shop</li>
            <li>On Sale</li>
            <li>New Arrivals</li>
            <li>Brands</li>
          </ul>
        </div>
        <NavbarIcons />
      </div>
      <label className="w-[86%] mx-auto mb-4 border-2 rounded-full border-gray-400 input">
        <svg
          className="h-[1em] opacity-50"
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
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input type="search" placeholder="Search" />
      </label>
    </header>
  );
};

export default Header;
