"use server";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { FaUser, FaShoppingBag, FaCog, FaShoppingCart, FaStore } from "react-icons/fa";
import SidebarTabs from "@/components/profile/SidebarTabs";
import { TabInterface } from "@/Interfaces";
import ThemeToggleFixed from "@/components/auth/ThemeToggleFixed";
import { getSession } from "@/lib/getSession";
import SignOut from "@/components/auth/SignOut";
import SidebarUserDetails from "@/components/profile/SidebarUserDetails";
import Greeting from "@/components/profile/Greeting";

const Profile = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();
  console.log("session is ----> ",session);
  const user = session?.user;
  if (!user) {
    redirect("/login");
  }

  const tabs: TabInterface[] = [
    { id: "personaldetails", label: "Profile", icon: <FaUser /> },
    { id: "usersettings", label: "Settings", icon: <FaCog /> },
    {
      id: "continueshopping",
      label: "Continue Shopping",
      icon: <FaStore />,
    },
  ];

  if (session?.user.role === "admin") {
    tabs.push(
      { id: "manageusers", label: "Manage Users", icon: <FaUser /> },
      {
      id: "managecategories",
      label: "Manage Categories",
      icon: <FaShoppingBag />,
      },
      {
      id: "manageorders",
      label: "Manage Orders",
      icon: <FaShoppingCart />,
      }
    );
  } else if (session?.user.role === "user") {
    tabs.push(
      { id: "orders", label: "Order History", icon: <FaShoppingBag /> },
      { id: "cart", label: "My Cart", icon: <FaShoppingCart /> }
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <ThemeToggleFixed />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <SidebarUserDetails id={user.id!} />

                <div className="divider"></div>

                <SidebarTabs tabs={tabs} userid={user.id!} />
                <SignOut />
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 flex flex-col">
            <Greeting id={user.id!} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
