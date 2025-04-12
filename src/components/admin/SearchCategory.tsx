"use client";

import React from "react";

const SearchCategory = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string | undefined;
  setSearchQuery: (str: string) => void;
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        name="search"
        id="search"
        placeholder="Search category by name or description"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input input-bordered w-full pl-10 pr-4"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchCategory;
