"use client";

import { useUpdateCategoryMutation } from "@/app/services/CategoryData";
import { CategoryInterface, UpdatedCategoryInterface } from "@/Interfaces";
import ToastStyles from "@/styles/ToastStyles";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal";
import MutationStateHandler from "../MutationStateHandler";

const EditCategory = ({ category }: { category: CategoryInterface }) => {
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] =
    useState<boolean>(false);
  const [categoryToEdit, setCategoryToEdit] =
    useState<CategoryInterface | null>(null);
  const [
    updateCategory,
    {
      isLoading: isLoadingUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
      isSuccess: isSuccessUpdate,
    },
  ] = useUpdateCategoryMutation();

  const openEditModal = (category: CategoryInterface) => {
    setCategoryToEdit(category);
    setIsEditCategoryModalOpen(true);
  };

  const handleUpdate = async (formData: FormData): Promise<void> => {
    if (!categoryToEdit) return;

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const metatitle = formData.get("metatitle") as string;
    const metadesc = formData.get("metadesc") as string;
    const metakeywords = formData.get("metakeywords") as string;
    const isfeatured = formData.get("isfeatured") === "on";

    const updatedCategory: UpdatedCategoryInterface = {
      name,
      description,
      metatitle,
      metadesc,
      metakeywords: metakeywords.split(",").map((keyword) => keyword.trim()),
      isfeatured,
    };

    try {
      await updateCategory({
        id: String(categoryToEdit._id),
        updatedCategory,
      });
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error("Could not update category", ToastStyles);
    } finally {
      setIsEditCategoryModalOpen(false);
      setCategoryToEdit(null);
    }
  };

  return (
    <>
      <MutationStateHandler
        isError={isErrorUpdate}
        isSuccess={isSuccessUpdate}
        error={errorUpdate}
        SuccessMessage="Category Updated Successfully"
      />
      <button
        onClick={() => openEditModal(category)}
        className="btn btn-sm btn-primary flex-1"
        disabled={isLoadingUpdate}
      >
        Edit
      </button>

      {/* Edit Category Modal */}
      {categoryToEdit && (
        <Modal
          IsOpen={isEditCategoryModalOpen}
          setIsOpen={setIsEditCategoryModalOpen}
          size="xl"
          title="Edit Category"
        >
          <form action={handleUpdate} className="space-y-4 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter category name"
                defaultValue={categoryToEdit.name}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                placeholder="Enter category description"
                defaultValue={categoryToEdit.description || ""}
                className="textarea textarea-bordered h-24 w-full"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Meta Title</span>
                </label>
                <input
                  type="text"
                  name="metatitle"
                  placeholder="Enter meta title"
                  defaultValue={categoryToEdit.metatitle || ""}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Meta Description</span>
                </label>
                <input
                  type="text"
                  name="metadesc"
                  placeholder="Enter meta description"
                  defaultValue={categoryToEdit.metadesc || ""}
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Meta Keywords (comma separated)
                </span>
              </label>
              <input
                type="text"
                name="metakeywords"
                placeholder="keyword1, keyword2, keyword3"
                defaultValue={categoryToEdit.metakeywords?.join(", ") || ""}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="cursor-pointer label justify-start gap-3">
                <input
                  type="checkbox"
                  name="isfeatured"
                  className="checkbox checkbox-primary"
                  defaultChecked={categoryToEdit.isfeatured}
                />
                <span className="label-text">Featured Category</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary"
              disabled={isLoadingUpdate}
            >
              {isLoadingUpdate ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating Category...
                </>
              ) : (
                "Update Category"
              )}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default EditCategory;
