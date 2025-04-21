"use client";

import { useUpdateProductMutation } from "@/app/services/ProductData";
import { ProductInterface, UpdatedProductInterface } from "@/Interfaces";
import ToastStyles from "@/styles/ToastStyles";
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "../Modal";
import MutationStateHandler from "../MutationStateHandler";

const EditProduct = ({product, categoryId}: {product: ProductInterface, categoryId: string}) => {

  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<ProductInterface | null>(null);
  const [
      updateProduct,
      {
        isLoading: isLoadingUpdate,
        isError: isErrorUpdate,
        error: errorUpdate,
        isSuccess: isSuccessUpdate,
      },
    ] = useUpdateProductMutation();

    const handleUpdateProduct = async (formData: FormData) => {

        if (!productToEdit) return;
        try {
          const updatedProduct: UpdatedProductInterface = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            price: Number(formData.get("price")),
            salePrice: formData.get("salePrice") ? Number(formData.get("salePrice")) : undefined,
            stock: Number(formData.get("stock")),
            isFeatured: formData.get("isFeatured") === "on",
            isOnSale: formData.get("isOnSale") === "on",
            sizes: formData.get("sizes") ? (formData.get("sizes") as string).split(",").map(size => size.trim()) : [],
            metatitle: formData.get("metatitle") as string,
            metadesc: formData.get("metadesc") as string,
            metakeywords: formData.get("metakeywords") ? 
              (formData.get("metakeywords") as string).split(",").map(keyword => keyword.trim()) : [],
          };
    
          await updateProduct({
            categoryId,
            productId: String(productToEdit._id),
            updatedProduct
          });
        } catch (error) {
          console.error("Error updating product:", error);
          toast.error("Failed to update product", ToastStyles);
        } finally {
          setProductToEdit(null);
          setIsEditProductModalOpen(false);
        }
      };

    const openEditModal = (product: ProductInterface) => {
        setProductToEdit(product);
        setIsEditProductModalOpen(true);
      };
    
  return (
    <>
    <MutationStateHandler isError={isErrorUpdate} isSuccess={isSuccessUpdate} error={errorUpdate} SuccessMessage="Updated Successfully" />
      <button
        onClick={() => openEditModal(product)}
        className="btn btn-sm btn-primary flex-1"
        disabled={isLoadingUpdate}
      >
        <FaEdit className="mr-1" /> Edit
      </button>

      {/* Edit Product Modal */}
      {productToEdit && (
        <Modal
          IsOpen={isEditProductModalOpen}
          setIsOpen={setIsEditProductModalOpen}
          size="xl"
          title="Edit Product"
        >
          <form action={handleUpdateProduct} className="space-y-4 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Name*</span>
              </label>
              <input
                type="text"
                name="name"
                defaultValue={productToEdit.name}
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
                defaultValue={productToEdit.description || ""}
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
                  defaultValue={productToEdit.price}
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
                  defaultValue={productToEdit.salePrice}
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
                defaultValue={productToEdit.stock}
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
                defaultValue={productToEdit.sizes?.join(", ") || ""}
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
                  defaultValue={productToEdit.metatitle || ""}
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
                  defaultValue={productToEdit.metadesc || ""}
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
                defaultValue={productToEdit.metakeywords?.join(", ") || ""}
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
                    defaultChecked={productToEdit.isFeatured}
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
                    defaultChecked={productToEdit.isOnSale}
                  />
                  <span className="label-text">On Sale</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary"
              disabled={isLoadingUpdate}
            >
              {isLoadingUpdate ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating Product...
                </>
              ) : (
                "Update Product"
              )}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default EditProduct;
