"use client";

import ToastStyles from "@/styles/ToastStyles";
import React, { useEffect } from "react";
import { LuCircleAlert } from "react-icons/lu";
import { toast } from "react-toastify";

type QueryStateHandlerProps = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  LoadingFull?: boolean;
};

const QueryStateHandler = ({
  isLoading,
  isError,
  error,
  LoadingFull = false
}: QueryStateHandlerProps) => {
  useEffect(() => {
    if (isError) {
      const err = error as {
        status?: number;
        data?: any;
        error?: string;
      };

      let message = "Unknown error";
      if (typeof err.data === "string") {
        message = err.data;
      } else if (typeof err.data === "object" && err.data?.message) {
        message = err.data.message;
      } else if (err.error) {
        message = err.error;
      }

      toast.error(`${message}`,ToastStyles);
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className={`h-full ${LoadingFull? "min-h-screen" : ""} grid place-content-center bg-base-300`}>
        <span className="loading loading-spinner text-accent loading-xl"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full grid place-content-center bg-base-300">
        <span className="bg-error p-4">
          <LuCircleAlert className="text-error-content" size={20} />
        </span>
      </div>
    );
  }

  return null;
};

export default QueryStateHandler;
