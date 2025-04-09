"use client";

import { useGetUserByIdQuery } from "@/app/services/UserData";
import React from "react";

const Greeting = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetUserByIdQuery(id);

  if (isLoading) {
    return (
      <div className="h-full grid place-content-center bg-base-300 col-span-1 md:col-span-3">
        <span className="loading loading-spinner text-accent loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-200 rounded-lg p-6 mb-4 shadow-md tracking-tight">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
        Hello, {data?.firstname} {data?.lastname}
      </h1>
    </div>
  );
};

export default Greeting;
