"use client";
import { useGetUserByIdQuery } from "@/app/services/UserData";
import { Image } from "@imagekit/next";
import React from "react";
import ProfileImgUpload from "./ProfileImgUpload";
import QueryStateHandler from "../QueryStateHandler";

const SidebarUserDetails = ({ id }: { id: string }) => {
  const { data, isLoading, isError, error } = useGetUserByIdQuery(id);

  return (
    <>
      <QueryStateHandler
        isError={isError}
        isLoading={isLoading}
        error={error}
      />

      {!isLoading && !isError && data && (
        <>
          <div className="avatar">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 relative">
              <Image
                src={data?.image ? data?.image : "/AccountFallback.png"}
                alt="Profile Image"
                width={128}
                height={128}
              />
              <ProfileImgUpload id={id} isAbsolute={true} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4">
            {data?.firstname} {data?.lastname}
          </h2>
          <p className="text-base-content/70">{data?.email}</p>
          <p className="text-base-content font-bold">{data?.role}</p>
        </>
      )}
    </>
  );
};

export default SidebarUserDetails;
