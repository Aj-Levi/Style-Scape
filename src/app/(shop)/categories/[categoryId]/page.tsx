"use client";

import React, { useState } from "react";
import { FaFilter, FaTimes, FaTag, FaStar } from "react-icons/fa";

import { useGetProductsByCategoryQuery } from "@/app/services/ProductData";
import { useGetCategoryByIdQuery } from "@/app/services/CategoryData";
import { ProductInterface } from "@/Interfaces";

import ProductCard from "@/components/shop/products/ProductCard";
import Search from "@/components/SearchBar";
import QueryStateHandler from "@/components/QueryStateHandler";

const CategoryProducts = ({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) => {
  const unwrappedParams = React.use(params);
  const { categoryId } = unwrappedParams;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [onlySale, setOnlySale] = useState<boolean>(false);
  const [MinPrice, setMinPrice] = useState<number>(0);
  const [MaxPrice, setMaxPrice] = useState<number>(100000);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const {
    data: category,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: Categoryerror,
  } = useGetCategoryByIdQuery(categoryId);
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: ProductsError,
  } = useGetProductsByCategoryQuery(categoryId);

  let filteredProducts: ProductInterface[] = products || [];

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  if (onlyFeatured) {
    filteredProducts = filteredProducts.filter((product) => product.isFeatured);
  }

  if (onlySale) {
    filteredProducts = filteredProducts.filter((product) => product.isOnSale);
  }

  if (MinPrice > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      product.salePrice
        ? product.salePrice >= MinPrice
        : product.price >= MinPrice
    );
  }

  if (MaxPrice < 100000) {
    filteredProducts = filteredProducts.filter((product) =>
      product.salePrice
        ? product.salePrice <= MaxPrice
        : product.price <= MaxPrice
    );
  }

  const reset = () => {
    setSearchQuery("");
    setMinPrice(0);
    setMaxPrice(100000);
    setOnlyFeatured(false);
    setOnlySale(false);
  };

  const hasActiveFilters =
    searchQuery ||
    onlyFeatured ||
    onlySale ||
    MinPrice > 0 ||
    MaxPrice < 100000;

  return (
    <>
      <QueryStateHandler
        isLoading={isCategoryLoading || isProductsLoading}
        isError={isCategoryError || isProductsError}
        error={ProductsError || Categoryerror}
        LoadingFull={true}
      />
      <div className="min-h-screen bg-base-100">
        {/* Hero section with category info */}
        <div className="bg-base-200 py-10 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold">
                {category?.name}
              </h1>
              {category?.isfeatured && (
                <div className="badge badge-secondary">Featured</div>
              )}
            </div>

            {category?.description && (
              <p className="text-base-content/70 max-w-3xl mb-6">
                {category.description}
              </p>
            )}

            {/* Search and filter toggle */}
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <Search
                SearchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />

              <button
                className={`btn ${showFilters ? "btn-primary" : "btn-outline"}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="badge badge-sm badge-primary ml-2">
                    {(onlyFeatured ? 1 : 0) +
                      (onlySale ? 1 : 0) +
                      (MinPrice > 0 ? 1 : 0) +
                      (MaxPrice < 100000 ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-base-200/50 border-y border-base-300 py-4 px-6 transition-all duration-300">
            <div className="container mx-auto max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-control bg-base-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FaStar className="mr-2 text-yellow-500" /> Featured
                    Products
                  </h3>
                  <label className="cursor-pointer label justify-start gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={onlyFeatured}
                      onChange={() => setOnlyFeatured((prev) => !prev)}
                    />
                    <span className="label-text">Show only featured</span>
                  </label>
                </div>

                <div className="form-control bg-base-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FaTag className="mr-2 text-error" /> Sale Products
                  </h3>
                  <label className="cursor-pointer label justify-start gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={onlySale}
                      onChange={() => setOnlySale((prev) => !prev)}
                    />
                    <span className="label-text">Show only on sale</span>
                  </label>
                </div>

                <div className="form-control bg-base-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-grow">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">
                      ₹
                      </span>
                      <input
                        type="number"
                        className="input input-sm input-bordered w-full pl-8"
                        value={MinPrice || ""}
                        placeholder="Min"
                        onChange={(e) =>
                          setMinPrice(Number(e.target.value) || 0)
                        }
                      />
                    </div>
                    <span className="text-base-content/70">to</span>
                    <div className="relative flex-grow">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">
                      ₹
                      </span>
                      <input
                        type="number"
                        className="input input-sm input-bordered w-full pl-8"
                        value={MaxPrice === 100000 ? "" : MaxPrice}
                        placeholder="Max"
                        onChange={(e) =>
                          setMaxPrice(Number(e.target.value) || 100000)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-center md:justify-end">
                  <button onClick={reset} className="btn btn-outline">
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products count */}
        <div className="container mx-auto max-w-7xl px-6 mt-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-base-content/70">
              Showing{" "}
              <span className="font-medium text-base-content">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto max-w-7xl px-6 pb-16">
          <QueryStateHandler
            isLoading={isCategoryLoading || isProductsLoading}
            isError={isCategoryError || isProductsError}
            error={ProductsError}
            LoadingFull={true}
          />
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product: ProductInterface) => (
                <ProductCard key={String(product._id)} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-base-200 rounded-lg p-10 text-center">
              <div className="max-w-md mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-base-content/30 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-base-content/60 mb-6">
                  We couldn&apos;t find any products matching your current filters.
                  Try adjusting your search or filter criteria.
                </p>
                <button onClick={reset} className="btn btn-primary">
                  <FaTimes className="mr-2" /> Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryProducts;
