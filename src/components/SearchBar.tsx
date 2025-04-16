import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const Search = ({
  SearchQuery,
  setSearchQuery,
}: {
  SearchQuery: string | undefined;
  setSearchQuery: (str: string) => void;
}) => {
  return (
    <div className="flex-1 w-full">
      <div className="relative">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search user by name or email"
          value={SearchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setSearchQuery(e.target.value)
          }
          className="input input-bordered w-full pr-4"
        />
        <button className="btn btn-primary absolute right-0 h-full px-5">
          {SearchQuery ? (
            <FaTimes
              className="h-5 w-5"
              onClick={() => setSearchQuery("")}
              title="Clear search"
            />
          ) : (
            <FaSearch className="h-5 w-5" title="Search" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Search;
