"use client";

import { useGetAllCategoriesQuery } from "@/app/services/CategoryData";
import { CategoryInterface } from "@/Interfaces";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import CategoryCard from "@/components/shop/categories/CategoryCard";
import QueryStateHandler from "@/components/QueryStateHandler";
import Search from "@/components/SearchBar";

const Category = () => {
  const [search, setSearch] = useState<string>("");
  const { data, isLoading, isError, error } = useGetAllCategoriesQuery();

  const filteredCategories: CategoryInterface[] | undefined = search
    ? data?.filter((item: CategoryInterface): boolean =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  return (
    <>
    <QueryStateHandler isError={isError} isLoading={isLoading} error={error} LoadingFull={true} />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">
        Categories
      </h1>

      <Search setSearchQuery={setSearch} SearchQuery={search} />

      {filteredCategories && filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((item) => (
            <div
              key={item.id || item.name}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative"
            >
              <CategoryCard category={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-10 h-80 card bg-base-200 p-10 shadow-md">
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
    </>
  );
};

export default Category;
