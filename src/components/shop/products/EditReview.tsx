"use client";

import React, { useState } from "react";
import { ReviewInterface, UpdatedReviewInterface } from "@/Interfaces";
import { FaEdit } from "react-icons/fa";
import { useUpdateProductReviewMutation } from "@/app/services/ProductData";
import MutationStateHandler from "@/components/MutationStateHandler";
import Modal from "@/components/Modal";
import RatingSelector from "./RatingAccessories";
import { toast } from "react-toastify";
import ToastStyles from "@/styles/ToastStyles";

const EditReview = ({
  review,
  productid,
}: {
  review: ReviewInterface;
  productid: string;
}) => {
  const [isEditReviewModalOpen, setIsEditReviewModalOpen] =
    useState<boolean>(false);
  const [ReviewToEdit, setReviewToEdit] = useState<ReviewInterface | null>(
    null
  );
  const [rating, setRating] = useState<number>(review.rating);
  const [comment, setComment] = useState<string>(review.comment || "");

  const [
    updateReview,
    {
      isLoading: isLoadingUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
      isSuccess: isSuccessUpdate,
    },
  ] = useUpdateProductReviewMutation();

  const openEditModal = (review: ReviewInterface) => {
    setReviewToEdit(review);
    setIsEditReviewModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!ReviewToEdit) return;

    const updatedReview: UpdatedReviewInterface = {
      rating,
      comment,
      reviewId: String(review._id),
    };

    try {
      await updateReview({ productid, updatedReview });
    } catch (err) {
      console.error("Could not update Review", err);
      toast.error("Could not update Review", ToastStyles);
    } finally {
      setIsEditReviewModalOpen(false);
      setReviewToEdit(null);
    }
  };

  return (
    <>
      <MutationStateHandler
        isError={isErrorUpdate}
        isSuccess={isSuccessUpdate}
        error={errorUpdate}
        SuccessMessage="Updated Successfully"
      />
      <button
        onClick={() => openEditModal(review)}
        className="btn btn-sm btn-primary gap-2"
        disabled={isLoadingUpdate}
      >
        <FaEdit /> Edit
      </button>

      {ReviewToEdit && (
        <Modal
          IsOpen={isEditReviewModalOpen}
          setIsOpen={setIsEditReviewModalOpen}
          title="Edit Review"
          size="xl"
        >
          <form action={handleSubmit} className="space-y-6 p-2">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Rating
              </label>
              <RatingSelector rating={rating} setRating={setRating} />
            </div>

            <div>
              <label
                htmlFor="review-comment"
                className="block text-sm font-medium mb-2"
              >
                Your Review
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="textarea textarea-bordered w-full"
                rows={5}
                placeholder="Share your thoughts about this product..."
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setIsEditReviewModalOpen(false);
                  setReviewToEdit(null);
                }}
                disabled={isLoadingUpdate}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoadingUpdate}
              >
                {isLoadingUpdate ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating...
                  </>
                ) : (
                  "Update Review"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default EditReview;
