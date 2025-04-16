"use client";

import {
  useGetAllCategoriesQuery,
} from "@/app/services/CategoryData";
import AddCategory from "@/components/admin/AddCategory";
import ThemeToggleLogin from "@/components/auth/ThemeToggleFixed";
import {
  CategoryInterface,
} from "@/Interfaces";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Image } from "@imagekit/next"
import CategoryImgUpload from "@/components/admin/CategoryImgUpload";
import Search from "@/components/SearchBar";
import EditCategory from "@/components/admin/EditCategory";
import DeleteCategory from "@/components/admin/DeleteCategory";
import QueryStateHandler from "@/components/QueryStateHandler";

const ManageCategories = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);

  const { data: categories, isLoading, isError, error } = useGetAllCategoriesQuery();

  const router = useRouter();

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
    <>
    <QueryStateHandler isLoading={isLoading} isError={isError} error={error} LoadingFull={true} />
    <div className="min-h-screen bg-base-100 p-6">
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
            <Search
              SearchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
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
                <p className="text-2xl font-bold mt-2 mb-4">{category.name}</p>
                <p className="text-sm line-clamp-2 mb-4 font-semibold">
                  {category.description || "No description available"}
                </p>
                <button onClick={():void => router.push(`/admin/managecategories/${String(category._id)}`)} className="btn btn-primary">See Products</button>
                <div className="card-actions justify-between mt-4">
                  <EditCategory category={category} />
                  <DeleteCategory categories={categories} CategoryId={String(category._id)} />
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
    </div>
    </>
  );
};

export default ManageCategories;
