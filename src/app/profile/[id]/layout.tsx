"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import {
  FaUser,
  FaShoppingBag,
  FaCog,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";
import loginbg from "@/public/HomeFavicon.png";
import SidebarTabs from "@/components/profile/SidebarTabs";
import { TabInterface } from "@/Interfaces";
import ThemeToggleLogin from "@/components/auth/ThemeToggleLogin";
import { useGetUserByIdQuery } from "../../services/UserData";
import { toast, ToastContainer } from "react-toastify";
import ToastStyles from "@/styles/ToastStyles";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const Profile = ({ children , params }: { children: ReactNode , params: Promise<{id: string}> }) => {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const router = useRouter();

  const {data , isError , isLoading} = useGetUserByIdQuery(id);

  if(isError){
    return (
      <div className="col-span-1 md:col-span-3">
        <div className="card bg-error shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title text-2xl text-error-content justify-center">Error Loading Profile</h2>
            <p className="text-error-content">We couldn't load the user information. Please try again later.</p>
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-outline btn-sm text-error-content" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(isLoading){
    return (
      <div className="h-screen w-screen grid place-content-center bg-base-300">
        <span className="loading loading-spinner text-accent loading-xl"></span>
      </div>
    );
  }

  const handleSignOut = async() => {
    try {
        toast.info("signing out please wait",ToastStyles);
        await signOut({ redirect: false });
        toast.success("Logged out successfully", ToastStyles);
        setTimeout(() => {
          router.replace("/home");
        }, 1500);
    } catch(err) {
      console.error("error while signing out the user", err);
      toast.error("Couldn't log out", ToastStyles)
    }
  }

  const tabs: TabInterface[] = [
    { id: "personaldetails", label: "Profile", icon: <FaUser /> },
    { id: "usersettings", label: "Settings", icon: <FaCog /> },
    {
      id: "continueshopping",
      label: "Continue Shopping",
      icon: <FaShoppingCart />,
    },
  ];

  if (data?.role === "admin") {
    tabs.push(
      { id: "manageusers", label: "Manage Users", icon: <FaUser /> },
      {
        id: "managecategories",
        label: "Manage Categories",
        icon: <FaShoppingBag />,
      }
    );
  } else if (data?.role === "user") {
    tabs.push({ id: "orders", label: "Orders", icon: <FaShoppingBag /> });
  }

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <ThemeToggleLogin />
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="avatar">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <Image
                      src={data?.image ? data?.image : loginbg}
                      alt="Profile"
                      width={128}
                      height={128}
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mt-4">
                  {data?.firstname} {data?.lastname}
                </h2>
                <p className="text-base-content/70">{data?.email}</p>

                <div className="divider"></div>

                {/* tabs  */}

                <SidebarTabs tabs={tabs} userid={id} />

                <button onClick={handleSignOut} className="btn btn-ghost justify-start w-full mt-4 text-error">
                  <span className="mr-2">
                    <FaSignOutAlt />
                  </span>{" "}
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 flex flex-col">
            <div className="bg-base-200 rounded-lg p-6 mb-4 shadow-md tracking-tight">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                Hello, {data?.firstname} {data?.lastname}
              </h1>
            </div>

            {/* Children Content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
