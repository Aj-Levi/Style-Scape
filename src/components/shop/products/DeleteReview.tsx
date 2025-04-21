"use client";

import { useDeleteProductReviewMutation } from "@/app/services/ProductData";
import Modal from "@/components/Modal";
import MutationStateHandler from "@/components/MutationStateHandler";
import { ReviewInterface } from "@/Interfaces";
import ToastStyles from "@/styles/ToastStyles";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const DeleteReview = ({
  review,
  productid,
}: {
  review: ReviewInterface;
  productid: string;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewInterface | null>(
    null
  );

  const [
    deleteReview,
    {
      isLoading: isLoadingDelete,
      isError: isErrorDelete,
      error: errorDelete,
      isSuccess: isSuccessDelete,
    },
  ] = useDeleteProductReviewMutation();

  const openDeleteModal = (review: ReviewInterface) => {
    setReviewToDelete(review);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;

    try {
      await deleteReview({ productid, id: { reviewId: String(review._id) } });
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Failed to delete product", ToastStyles);
    } finally {
      setReviewToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <MutationStateHandler
        isError={isErrorDelete}
        isSuccess={isSuccessDelete}
        error={errorDelete}
        SuccessMessage="Deleted Successfully"
      />
      <button
        onClick={() => openDeleteModal(review)}
        className="btn btn-sm btn-outline btn-error gap-2"
        disabled={isLoadingDelete}
      >
        <FaTrash /> Delete
      </button>

      {reviewToDelete && (
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
              Are you sure you want to delete this Review ?
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
                onClick={handleDelete}
                className="btn btn-error"
                disabled={isLoadingDelete}
              >
                {isLoadingDelete ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DeleteReview;
