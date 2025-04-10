import Image from "next/image";
import React from "react";
import NavbarIcons from "./NavbarIcons";
import SidebarMenuBtn from "./buttons/SidebarMenuBtn";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex flex-col w-screen border-b-2 bg-base-100">
      <div className="flex lg:w-[86%] lg:mx-auto py-4 lg:justify-between lg:items-center px-4 w-full justify-between items-center">
        <SidebarMenuBtn />
        <div className="flex items-center gap-x-8">
          <div className="flex items-center cursor-pointer gap-x-4">
            <div className="relative w-8 h-8 rounded-full">
              <Image
                src={'/HomeFavicon.png'}
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
            <li>Fetaured</li>
            <li>New Arrivals</li>
            <Link href={`/categories`}>
              <li>Categories</li>
            </Link>
          </ul>
        </div>
        <NavbarIcons />
      </div>
    </header>
  );
};

export default Header;
