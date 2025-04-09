"use client";

import { useGetUserByIdQuery } from "@/app/services/UserData";
import Image from "next/image";
import React from "react";
import loginbg from "@/public/HomeFavicon.png";

const SidebarUserDetails = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetUserByIdQuery(id);

  if (isLoading) {
    return (
      <div className="h-full grid place-content-center bg-base-300 col-span-1 md:col-span-3">
        <span className="loading loading-spinner text-accent loading-xl"></span>
      </div>
    );
  }

  return (
    <>
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
      <p className="text-base-content font-bold">{data?.role}</p>
    </>
  );
};

export default SidebarUserDetails;
