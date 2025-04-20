"use client";

import { useCancelOrderMutation } from "@/app/services/OrderData";
import Modal from "@/components/Modal";
import MutationStateHandler from "@/components/MutationStateHandler";
import ToastStyles from "@/styles/ToastStyles";
import React, { useState } from "react";
import { toast } from "react-toastify";

const CancelOrder = ({ orderId }: { orderId: string }) => {
  const [OrderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [CancelOrder, { isLoading, isError, isSuccess, error }] =
    useCancelOrderMutation();

  const handleCancelOrder = async () => {
    if (!OrderToDelete) return;
    try {
      setIsCancelling(true);
      await CancelOrder(String(orderId));
    } catch (error) {
      toast.error("Could Not Cancel The Order", ToastStyles);
    } finally {
      setIsCancelling(false);
    }
  };

  const openDeleteModal = (order_Id: string) => {
    setOrderToDelete(order_Id);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <MutationStateHandler
        isError={isError}
        isSuccess={isSuccess}
        error={error}
        SuccessMessage="Order Cancelled"
      />
      <button
        onClick={() => openDeleteModal(orderId)}
        className="btn btn-error btn-sm"
      >
        Cancel
      </button>

      {OrderToDelete && (
        <Modal
          IsOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          title="Delete Product"
        >
          <div className="py-4">
            <div className="flex items-center justify-center mb-4 text-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <p className="text-lg text-center mb-2">
              Are you sure you want to delete this Order
            </p>
            <p className="text-center text-gray-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelOrder}
                className="btn btn-error"
                disabled={isLoading || isCancelling}
              >
                {isLoading || isCancelling ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Cancelling...
                  </>
                ) : (
                  "Cancel"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CancelOrder;
