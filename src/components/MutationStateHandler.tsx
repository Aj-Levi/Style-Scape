"use client";

import ToastStyles from "@/styles/ToastStyles";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

interface MutationStateHandlerProps {
    isError: boolean;
    error: unknown;
    isSuccess?: boolean;
    SuccessMessage: string; 
  };
  
  const MutationStateHandler = ({
    isError,
    error,
    isSuccess,
    SuccessMessage,
  }: MutationStateHandlerProps) => {
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
  
        toast.error(`${message}`, ToastStyles);
      }
  
      if (isSuccess) {
        toast.success(SuccessMessage, ToastStyles);
      }
    }, [isError, isSuccess, error]);
  
    return null;
  };

  export default MutationStateHandler;
  