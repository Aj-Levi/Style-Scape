"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Image } from "@imagekit/next";

import { 
  useGetProductsByCategoryQuery, 
} from "@/app/services/ProductData";
import { useGetCategoryByIdQuery } from "@/app/services/CategoryData";

import ThemeToggleLogin from "@/components/auth/ThemeToggleFixed";
import ProductImgUpload from "@/components/admin/ProductImgUpload";
import AddProduct from "@/components/admin/AddProduct";
import Search from "@/components/SearchBar";
import QueryStateHandler from "@/components/QueryStateHandler";
import EditProduct from "@/components/admin/EditProduct";
import DeleteProduct from "@/components/admin/DeleteProduct";

const ManageCategoryProducts = ({ params }: { params: Promise<{ categoryId: string }> }) => {
  const unwrappedParams = React.use(params);
  const { categoryId } = unwrappedParams;
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [onlySale, setOnlySale] = useState<boolean>(false);

  const { data: category, isLoading: isCategoryLoading, isError: isCategoryError, error: errorCategory } = useGetCategoryByIdQuery(categoryId);
  const { data: products, isLoading: isProductsLoading, isError: isProductError, error: errorProduct } = useGetProductsByCategoryQuery(categoryId);

  // Filter products
  let filteredProducts = products || [];
  
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  
  if (onlyFeatured) {
    filteredProducts = filteredProducts.filter(product => product.isFeatured);
  }
  
  if (onlySale) {
    filteredProducts = filteredProducts.filter(product => product.isOnSale);
  }

  return (
    <>
    <QueryStateHandler isLoading={isCategoryLoading || isProductsLoading} isError={isCategoryError || isProductError} error={errorProduct || errorCategory} LoadingFull={true} />
    <div className="min-h-screen bg-base-100 p-6">
      {/* Header */}
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
          Back to Categories
        </button>
        <ThemeToggleLogin />
      </div>

      {/* Page Title and Category Info */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold underline decoration-3">
            {category?.name} Products
          </h1>
          {category?.isfeatured && (
            <div className="badge badge-secondary">Featured Category</div>
          )}
        </div>

        {category?.description && (
          <p className="text-base-content/70 mb-6">{category.description}</p>
        )}

        {/* Search and Add Product */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex-1 w-full">
            <Search SearchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>

          <AddProduct category={category} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="form-control">
            <label className="cursor-pointer label gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={onlyFeatured}
                onChange={() => setOnlyFeatured((prev) => !prev)}
              />
              <span className="label-text">Only Featured Products</span>
            </label>
          </div>
          <div className="form-control">
            <label className="cursor-pointer label gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={onlySale}
                onChange={() => setOnlySale((prev) => !prev)}
              />
              <span className="label-text">Only Sale Products</span>
            </label>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={String(product._id)}
              className="card bg-base-200 shadow-xl"
            >
              <figure className="relative h-48">
                <div className="relative h-full w-full group">
                  {product.images && product.images.length > 0 ? (
                    <div className="h-full w-full overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={400}
                        height={192}
                        className="h-full w-full object-cover group-hover:scale-110 transition-all duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-base-300 flex items-center justify-center">
                      <h3 className="text-xl font-bold text-center px-2">
                        {product.name}
                      </h3>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white text-center px-2">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Product Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {product.isFeatured && (
                    <div className="badge badge-secondary">Featured</div>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  {product.isOnSale && (
                    <div className="badge badge-accent">Sale</div>
                  )}
                </div>
              </figure>

              <div className="card-body p-4">
                <h2 className="card-title text-lg">{product.name}</h2>

                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold">
                    {product.isOnSale && product.salePrice ? (
                      <div className="flex gap-2 items-center">
                        <span className="text-md font-bold">
                        ₹{product.salePrice}
                        </span>
                        <span className="text-sm line-through opacity-60">
                        ₹{product.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-md font-bold">₹{product.price}</span>
                    )}
                  </div>
                  <div className="badge badge-outline font-semibold">
                    Stock: {product.stock}
                  </div>
                </div>

                {product.description && (
                  <p className="text-sm line-clamp-2 mb-2">
                    {product.description}
                  </p>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="badge badge-sm badge-outline"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                )}

                <div className="card-actions justify-between mt-2">
                  <EditProduct product={product} categoryId={categoryId} />
                  <DeleteProduct product={product} categoryId={categoryId} />
                  <div className="bg-accent p-[0.41rem] rounded-lg">
                    <ProductImgUpload
                      categoryId={categoryId}
                      productId={String(product._id)}
                      currentImages={product.images || []}
                    />
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
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <p className="text-lg font-medium">No products found</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ManageCategoryProducts;