"use client";

import { useAddProductReviewMutation } from "@/app/services/ProductData";
import Modal from "@/components/Modal";
import MutationStateHandler from "@/components/MutationStateHandler";
import React, { useState } from "react";
import RatingSelector from "./RatingAccessories";
import { toast } from "react-toastify";
import ToastStyles from "@/styles/ToastStyles";
import { AddReviewInterface } from "@/Interfaces";
import { set } from "mongoose";

const AddReview = ({ productid }: { productid: string }) => {
  const [isAddProductModalOpen, setIsAddProductModalOpen] =
    useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const [
    addReview,
    {
      isLoading: isLoadingAdd,
      isError: isErrorAdd,
      isSuccess: isSuccessAdd,
      error: errorAdd,
    },
  ] = useAddProductReviewMutation();

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      const newReview: AddReviewInterface = {
        rating,
        comment,
      };
      await addReview({ productid, review: newReview });
    } catch (error) {
      toast.error("Could not add the review", ToastStyles);
    } finally {
      setIsAddProductModalOpen(false);
      setIsAdding(false);
    }
  };

  return (
    <>
      <MutationStateHandler
        isError={isErrorAdd}
        isSuccess={isSuccessAdd}
        error={errorAdd}
        SuccessMessage="Review Added Successfully"
      />
      <button
        onClick={() => setIsAddProductModalOpen(true)}
        className="btn btn-primary mr-4 font-bold"
        disabled={isLoadingAdd || isAdding}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Review
      </button>

      <Modal
        IsOpen={isAddProductModalOpen}
        setIsOpen={setIsAddProductModalOpen}
        title="Add Review"
        size="xl"
      >
        <form action={handleAdd} className="space-y-6 p-2">
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
                setIsAddProductModalOpen(false);
              }}
              disabled={isLoadingAdd || isAdding}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoadingAdd || isAdding}
            >
              {(isLoadingAdd || isAdding) ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding...
                </>
              ) : (
                "Add Review"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddReview;
