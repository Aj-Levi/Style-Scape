import { useMarkOrderAsDeliveredMutation } from "@/app/services/OrderData";
import ToastStyles from "@/styles/ToastStyles";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import MutationStateHandler from "../MutationStateHandler";

const MarkOrderDelivered = ({ orderId }: { orderId: string }) => {
  const [Isupdating, setIsupdating] = useState<boolean>(false);
  const [markAsDelivered, { isLoading, isError, isSuccess, error }] =
    useMarkOrderAsDeliveredMutation();

  const handleMarkDelivered = async (orderId: string) => {
    setIsupdating(true);
    try {
      await markAsDelivered(orderId);
    } catch (error) {
      console.error("Error marking order as delivered:", error);
      toast.error("Failed to mark order as delivered", ToastStyles);
    } finally {
      setIsupdating(false);
    }
  };

  return (
    <>
      <MutationStateHandler
        isError={isError}
        isSuccess={isSuccess}
        error={error}
        SuccessMessage="Updated Successfully"
      />
      <button
        onClick={() => handleMarkDelivered(orderId)}
        className="btn btn-sm btn-success"
        disabled={isLoading || Isupdating}
      >
        {isLoading || Isupdating ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Updating...
          </>
        ) : (
          <FaCheck size={12} />
        )}
      </button>
    </>
  );
};

export default MarkOrderDelivered;
