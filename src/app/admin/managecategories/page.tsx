"use client";

import {
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/app/services/CategoryData";
import AddCategory from "@/components/admin/AddCategory";
import SearchCategory from "@/components/admin/SearchCategory";
import ThemeToggleLogin from "@/components/auth/ThemeToggleLogin";
import Modal from "@/components/Modal";
import {
  CategoryInterface,
  UpdatedCategoryInterface,
} from "@/Interfaces";
import ToastStyles from "@/styles/ToastStyles";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Image } from "@imagekit/next"
import CategoryImgUpload from "@/components/admin/CategoryImgUpload";

const ManageCategories = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] =
    useState<boolean>(false);
  const [categoryToEdit, setCategoryToEdit] =
    useState<CategoryInterface | null>(null);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { data: categories, isLoading } = useGetAllCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="h-screen grid place-content-center bg-base-300">
        <span className="loading loading-spinner text-accent loading-xl"></span>
      </div>
    );
  }

  const handleDeletion = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully", ToastStyles);
    } catch (err) {
      toast.error("Could not delete the category", ToastStyles);
      console.error("Could not delete the category", err);
    } finally {
      setIsDeleting(false);
      setCategoryIdToDelete(null);
    }
  };

  const handleUpdate = async (formData: FormData): Promise<void> => {
    if (!categoryToEdit) return;

    setIsUpdating(true);
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
      toast.success("Category updated successfully", ToastStyles);
    } catch (err) {
      console.error("Could not update category", err);
      toast.error("Could not update category", ToastStyles);
    } finally {
      setIsUpdating(false);
      setIsEditCategoryModalOpen(false);
      setCategoryToEdit(null);
    }
  };

  const openEditModal = (category: CategoryInterface) => {
    setCategoryToEdit(category);
    setIsEditCategoryModalOpen(true);
  };

  let filteredCategories: CategoryInterface[] | undefined = searchQuery
    ? categories?.filter(
        (category: CategoryInterface) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (category.description &&
            category.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      )
    : categories;

  if (onlyFeatured) {
    filteredCategories = filteredCategories?.filter(
      (category: CategoryInterface) => category.isfeatured
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => router.back()} className="btn btn-outline">
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </button>
        <ThemeToggleLogin />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 underline decoration-3">
          Manage Categories
        </h1>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex-1">
            {/* search categories */}
            <SearchCategory
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          {/* add category */}
          <AddCategory />
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="form-control">
            <label className="cursor-pointer label gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                name="onlyfeatured"
                id="onlyfeatured"
                checked={onlyFeatured}
                onChange={() => setOnlyFeatured((prev) => !prev)}
              />
              <span className="label-text">Only Featured Categories</span>
            </label>
          </div>
        </div>
      </div>

      {/* Grid layout for categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCategories && filteredCategories.length > 0 ? (
          filteredCategories.map((category: CategoryInterface) => (
            <div
              key={String(category._id)}
              className="card bg-base-200 shadow-xl"
            >
              <figure className="relative h-48">
                <div className="relative h-full w-full group">
                  {category.image ? (
                    <div className="h-full w-full overflow-hidden">
                      <div className="h-full w-full object-cover group-hover:scale-110 transition-all duration-500">
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={400}
                          height={192}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-base-300 flex items-center justify-center">
                      <h3 className="text-xl font-bold text-center px-2">
                        {category.name}
                      </h3>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white text-center px-2">
                      {category.name}
                    </h3>
                  </div>
                </div>
                {category.isfeatured && (
                  <div className="absolute top-2 right-2 badge badge-secondary">
                    Featured
                  </div>
                )}
              </figure>
              <div className="card-body">
                <p className="text-sm line-clamp-2">
                  {category.description || "No description available"}
                </p>
                <button onClick={():void => router.push(`/admin/managecategories/${String(category._id)}`)} className="btn btn-primary">See Products</button>
                <div className="card-actions justify-between mt-4">
                  <button
                    onClick={() => openEditModal(category)}
                    className="btn btn-sm btn-primary flex-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setCategoryIdToDelete(String(category._id))}
                    className="btn btn-sm btn-error flex-1"
                  >
                    Delete
                  </button>
                  <div className="bg-accent p-[0.41rem] rounded-lg">
                    <CategoryImgUpload id={String(category._id)} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 bg-base-200 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
              />
            </svg>
            <p className="text-lg font-medium">No categories found</p>
          </div>
        )}
      </div>

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
              disabled={isUpdating}
            >
              {isUpdating ? (
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
                disabled={isDeleting}
              >
                {isDeleting ? (
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
    </div>
  );
};

export default ManageCategories;
