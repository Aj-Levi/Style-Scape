"use client";

import { useGetUserByIdQuery } from "@/app/services/UserData";
import React from "react";
import QueryStateHandler from "../QueryStateHandler";

const Greeting = ({ id }: { id: string }) => {
  const { data, isLoading, isError, error } = useGetUserByIdQuery(id);

  return (
    <>
      <QueryStateHandler
        isError={isError}
        isLoading={isLoading}
        error={error}
      />
      {!isLoading && !isError && data && (
        <div className="bg-base-200 rounded-lg p-6 mb-4 shadow-md tracking-tight">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Hello, {data?.firstname} {data?.lastname}
          </h1>
        </div>
      )}
    </>
  );
};

export default Greeting;
