"use client";
import React from "react";
import { useZustandStore } from "@/lib/stores/ZustandStore";
import Link from "next/link";
import { FaHome, FaShoppingBag, FaShoppingCart, FaUser } from "react-icons/fa";

interface SidebarProps {
  id?: string;
  role?: string;
  firstname?: string;
  lastname?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  createdAt?: Date | string;
}

const Sidebar = ({ user }: {user: SidebarProps}) => {
  const { isSidebarOpen, toggleSidebar } = useZustandStore();

  const closeSidebar = (e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLLIElement>) => {
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
        className={`w-[45vw] lg:w-[30vw] flex flex-col max-sm:w-screen fixed left-0 top-0 bottom-0 z-20 bg-base-100 transition-transform duration-700 rounded-r-xl ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="flex justify-center items-center mt-18 p-4 border-b border-base-300 bg-base-200">
          <h2 className="text-xl font-semibold text-primary">Style Scape</h2>
        </div>

        <div className="flex flex-col flex-1 justify-between">
          <div>
            {/* Main navigation */}
            <nav className="p-4 border-b border-base-300">
              <ul className="menu menu-vertical gap-1 text-base-content">
                <li onClick={(e): void => closeSidebar(e)}>
                  <Link href="/home" className="flex items-center gap-3">
                    <FaHome size={18} />
                    <span>Home</span>
                  </Link>
                </li>
                <li onClick={(e): void => closeSidebar(e)}>
                  <Link href="/categories" className="flex items-center gap-3">
                    <FaShoppingBag size={18} />
                    <span>Collections</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            {/* Categories section */}
            <div className="p-4 border-b border-base-300 bg-base-100">
              <h3 className="font-medium mb-3 text-secondary">Categories</h3>
              <ul className="menu menu-vertical gap-1 text-base-content">
                <li onClick={(e): void => closeSidebar(e)}>
                  <Link
                    className="font-semibold"
                    href="/categories/67f7b396680e690029227e86"
                  >
                    Men&apos;s Collection
                  </Link>
                </li>
                <li onClick={(e): void => closeSidebar(e)}>
                  <Link
                    className="font-semibold"
                    href="/categories/67f7b507680e690029227e8b"
                  >
                    Women&apos;s Collection
                  </Link>
                </li>
                <li onClick={(e): void => closeSidebar(e)}>
                  <Link
                    className="font-semibold"
                    href="/categories/67f7b579680e690029227e8e"
                  >
                    Kid&apos;s Collection
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div>
            {user && (
              <div className="p-4 border-b border-base-300 bg-base-200">
                <h3 className="font-medium mb-3 text-secondary">Account</h3>
                <ul className="menu menu-vertical gap-1 text-base-content">
                  <li onClick={(e): void => closeSidebar(e)}>
                    <Link
                      href={`/profile/${user.id}/profiledetails`}
                      className="flex items-center gap-3"
                    >
                      <FaUser size={18} />
                      <span>My Account</span>
                    </Link>
                  </li>
                  <li onClick={(e): void => closeSidebar(e)}>
                    <Link
                      href="/profile/${user.id}/cart"
                      className="flex items-center gap-3"
                    >
                      <FaShoppingCart size={18} />
                      <span className="flex justify-between w-full">Cart</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Footer */}
            <div className="p-4 mt-auto bg-base-300 text-center text-sm text-base-content">
              <p>© 2025 Style Scape. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
