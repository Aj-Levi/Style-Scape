import React from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { RiAccountCircleLine } from "react-icons/ri";
import ThemeToggle from "./buttons/ThemeToggle";
import { getSession } from "@/lib/getSession";
import Link from "next/link";

const NavbarIcons = async () => {
  const session = await getSession();

  return (
    <div className="flex items-center gap-x-2 *:cursor-pointer">
      <button
        className={`btn btn-primary max-md:p-2 ${
          session?.user ? "" : "hidden"
        }`}
      >
        <HiOutlineShoppingCart className={`w-4 h-4 md:w-5 md:h-5`} />
      </button>
      <Link href={session?.user ? `/profile/${session?.user.id}/personaldetails` : "/login"}>
        <button className={`btn btn-primary max-md:p-2`}>
          <RiAccountCircleLine className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </Link>
      <ThemeToggle />
    </div>
  );
};

export default NavbarIcons;
