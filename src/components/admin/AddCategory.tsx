"use client";

import React, { useState } from "react";
import Modal from "../Modal";
import { AddCategoryInterface } from "@/Interfaces";
import { useAddCategoryMutation } from "@/app/services/CategoryData";
import { toast } from "react-toastify";
import ToastStyles from "@/styles/ToastStyles";

const AddCategory = () => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] =
    useState<boolean>(false);
  const [addCategory] = useAddCategoryMutation();

  const handleAdd = async (formData: FormData): Promise<void> => {
    setIsAdding(true);
    const name = formData.get("name") as string;
    const image = formData.get("image") as string;
    const description = formData.get("description") as string;
    const metatitle = formData.get("metatitle") as string;
    const metadesc = formData.get("metadesc") as string;
    const metakeywords = formData.get("metakeywords") as string;
    const isfeatured = formData.get("isfeatured") === "on";

    const category: AddCategoryInterface = {
      name,
      image,
      description,
      metatitle,
      metadesc,
      metakeywords: metakeywords.split(",").map((keyword) => keyword.trim()),
      isfeatured,
    };

    try {
      const response = await addCategory(category).unwrap();
      if (response.success) {
        toast.success("Category added successfully", ToastStyles);
      } else {
        toast.warn(response.message, ToastStyles);
      }
    } catch (err) {
      console.error("Could not add category", err);
      toast.error("Could not add category", ToastStyles);
    } finally {
      setIsAdding(false);
      setIsAddCategoryModalOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsAddCategoryModalOpen(true)}
        className="btn btn-primary"
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
        Add Category
      </button>
      <Modal
        IsOpen={isAddCategoryModalOpen}
        setIsOpen={setIsAddCategoryModalOpen}
        size="xl"
        title="Add Category"
      >
        <form action={handleAdd} className="space-y-4 mt-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter category name"
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
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="cursor-pointer label justify-start gap-3">
              <input
                type="checkbox"
                name="isfeatured"
                className="checkbox checkbox-primary"
              />
              <span className="label-text">Featured Category</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Adding Category...
              </>
            ) : (
              "Add Category"
            )}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default AddCategory;
