"use client";

import { useGetAllCategoriesQuery } from "@/app/services/CategoryData";
import ImageKit from "@/components/shop/ImageKit";
import { CategoryInterface } from "@/Interfaces";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const Category = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const { data, isLoading } = useGetAllCategoriesQuery();

  if (isLoading) {
    return (
      <div className="h-screen grid place-content-center bg-base-200">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  const filteredCategories: CategoryInterface[] | undefined = search
    ? data?.filter((item: CategoryInterface): boolean =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">
        Categories
      </h1>

      <div className="form-control mb-10 w-full">
        <div className="input-group flex w-full relative shadow-md rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setSearch(e.target.value)
            }
            className="input input-bordered w-full focus:outline-none focus:border-primary px-5 py-3 text-lg"
          />
          <button className="btn btn-primary absolute right-0 h-full px-5">
            {search ? (
              <FaTimes
                className="h-5 w-5"
                onClick={() => setSearch("")}
                title="Clear search"
              />
            ) : (
              <FaSearch className="h-5 w-5" title="Search" />
            )}
          </button>
        </div>
      </div>

      {filteredCategories && filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((item) => (
            <div
              key={item.id || item.name}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative"
            >
              {item.isfeatured && (
                <div className="badge badge-accent font-semibold absolute top-2 right-2 z-10">
                  Featured
                </div>
              )}
              <figure className="h-64 overflow-hidden">
                <div className="h-full w-full hover:scale-110 transition-all duration-500">
                  <ImageKit
                    src={item.image ? item.image : ""}
                    alt={item.name}
                    height={400}
                    width={600}
                  />
                </div>
              </figure>
              <div className="card-body p-6">
                <h2 className="card-title text-xl">{item.name}</h2>
                <div className="card-actions justify-end mt-3">
                  <button
                    onClick={(): void => router.push(`/categories/${item._id}`)}
                    className="btn btn-primary"
                  >
                    View Products
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-80 card bg-base-200 p-10 shadow-md">
          <p className="text-2xl mb-6 text-center">No categories found</p>
          <button
            onClick={() => setSearch("")}
            className="btn btn-primary btn-lg gap-2"
          >
            <FaTimes /> Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default Category;
