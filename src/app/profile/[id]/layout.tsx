import React, { ReactNode } from "react";
import { FaUser, FaShoppingBag, FaCog, FaShoppingCart } from "react-icons/fa";
import SidebarTabs from "@/components/profile/SidebarTabs";
import { TabInterface } from "@/Interfaces";
import ThemeToggleLogin from "@/components/auth/ThemeToggleLogin";
import { getSession } from "@/lib/getSession";
import SignOut from "@/components/auth/SignOut";
import SidebarUserDetails from "@/components/profile/SidebarUserDetails";
import Greeting from "@/components/profile/Greeting";

const Profile = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();

  const tabs: TabInterface[] = [
    { id: "personaldetails", label: "Profile", icon: <FaUser /> },
    { id: "usersettings", label: "Settings", icon: <FaCog /> },
    {
      id: "continueshopping",
      label: "Continue Shopping",
      icon: <FaShoppingCart />,
    },
  ];

  if (session?.user.role === "admin") {
    tabs.push(
      { id: "manageusers", label: "Manage Users", icon: <FaUser /> },
      {
        id: "managecategories",
        label: "Manage Categories",
        icon: <FaShoppingBag />,
      }
    );
  } else if (session?.user.role === "user") {
    tabs.push({ id: "orders", label: "Orders", icon: <FaShoppingBag /> });
  }

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <ThemeToggleLogin />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <SidebarUserDetails id={session?.user.id!} />

                <div className="divider"></div>

                <SidebarTabs tabs={tabs} userid={session?.user.id!} />
                <SignOut />
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 flex flex-col">
            <Greeting id={session?.user.id!} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
