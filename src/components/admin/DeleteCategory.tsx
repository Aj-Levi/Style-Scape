"use client";

import { useDeleteCategoryMutation } from "@/app/services/CategoryData";
import { CategoryInterface } from "@/Interfaces";
import ToastStyles from "@/styles/ToastStyles";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal";
import MutationStateHandler from "../MutationStateHandler";

const DeleteCategory = ({
  categories,
  CategoryId,
}: {
  categories: CategoryInterface[] | undefined;
  CategoryId: string;
}) => {
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null
  );
  const [
    deleteCategory,
    {
      isLoading: isLoadingDelete,
      isError: isErrorDelete,
      error: errorDelete,
      isSuccess: isSuccessDelete,
    },
  ] = useDeleteCategoryMutation();

  const handleDeletion = async (id: string) => {
    try {
      await deleteCategory(id);
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("Could not delete the category", ToastStyles);
    } finally {
      setCategoryIdToDelete(null);
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
        onClick={() => setCategoryIdToDelete(CategoryId)}
        className="btn btn-sm btn-error flex-1"
        disabled={isLoadingDelete}
      >
        Delete
      </button>

      {/* Delete Confirmation Modal */}
      {categories?.map((category: CategoryInterface) => (
        <Modal
          key={`delete-modal-${category._id}`}
          IsOpen={categoryIdToDelete === String(category._id)}
          setIsOpen={() => setCategoryIdToDelete(null)}
          title="Delete Category"
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
              Are you sure you want to delete category:{" "}
              <span className="font-bold">{category.name}</span>?
            </p>
            <p className="text-center text-gray-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setCategoryIdToDelete(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletion(String(category._id))}
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
      ))}
    </>
  );
};

export default DeleteCategory;
