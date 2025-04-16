"use client";

import React, { useState } from "react";
import Modal from "../Modal";
import { useAddProductMutation } from "@/app/services/ProductData";
import { AddProductInterface, CategoryInterface } from "@/Interfaces";
import { toast } from "react-toastify";
import ToastStyles from "@/styles/ToastStyles";
import MutationStateHandler from "../MutationStateHandler";

const AddProduct = ({ category }: { category: CategoryInterface | undefined }) => {
  const [isAddProductModalOpen, setIsAddProductModalOpen] =
    useState<boolean>(false);
  const [addProduct, {isLoading: isLoadingAdd, isError: isErrorAdd, isSuccess: isSuccessAdd, error: errorAdd}] = useAddProductMutation();

  const handleAddProduct = async (formData: FormData) => {
    try {
      const newProduct: AddProductInterface = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        salePrice: formData.get("salePrice")
          ? Number(formData.get("salePrice"))
          : undefined,
        category: category?.name,
        categoryId: String(category?._id),
        stock: Number(formData.get("stock")),
        isFeatured: formData.get("isFeatured") === "on",
        isOnSale: formData.get("isOnSale") === "on",
        sizes: formData.get("sizes")
          ? (formData.get("sizes") as string)
              .split(",")
              .map((size) => size.trim())
          : [],
        metatitle: formData.get("metatitle") as string,
        metadesc: formData.get("metadesc") as string,
        metakeywords: formData.get("metakeywords")
          ? (formData.get("metakeywords") as string)
              .split(",")
              .map((keyword) => keyword.trim())
          : [],
      };

      await addProduct(newProduct);
    } catch (error) {
      toast.error("Failed to add product", ToastStyles);
    } finally {
      setIsAddProductModalOpen(false);
    }
  };

  return (
    <>
    <MutationStateHandler isError={isErrorAdd} isSuccess={isSuccessAdd} error={errorAdd} SuccessMessage="Product Added Successfully" />
      <button
        onClick={() => setIsAddProductModalOpen(true)}
        className="btn btn-primary"
        disabled={isLoadingAdd}
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
        IsOpen={isAddProductModalOpen}
        setIsOpen={setIsAddProductModalOpen}
        size="xl"
        title="Add Product"
      >
        <form action={handleAddProduct} className="space-y-4 mt-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Name*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
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
              placeholder="Enter product description"
              className="textarea textarea-bordered h-24 w-full"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Price*</span>
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                placeholder="Regular price"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Sale Price</span>
              </label>
              <input
                type="number"
                name="salePrice"
                step="0.01"
                min="0"
                placeholder="Sale price (if applicable)"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Stock*</span>
            </label>
            <input
              type="number"
              name="stock"
              min="0"
              placeholder="Available quantity"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Sizes (comma separated)</span>
            </label>
            <input
              type="text"
              name="sizes"
              placeholder="S, M, L, XL"
              className="input input-bordered w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Meta Title</span>
              </label>
              <input
                type="text"
                name="metatitle"
                placeholder="SEO meta title"
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
                placeholder="SEO meta description"
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

          <div className="flex flex-wrap gap-4">
            <div className="form-control">
              <label className="cursor-pointer label justify-start gap-3">
                <input
                  type="checkbox"
                  name="isFeatured"
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Featured Product</span>
              </label>
            </div>

            <div className="form-control">
              <label className="cursor-pointer label justify-start gap-3">
                <input
                  type="checkbox"
                  name="isOnSale"
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">On Sale</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={isLoadingAdd}
          >
            {isLoadingAdd ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Adding Product...
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default AddProduct;
