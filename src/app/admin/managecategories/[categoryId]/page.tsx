"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { Image } from "@imagekit/next";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import { 
  useGetProductsByCategoryQuery, 
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/app/services/ProductData";
import { useGetCategoryByIdQuery } from "@/app/services/CategoryData";
import { 
  ProductInterface, 
  UpdatedProductInterface, 
} from "@/Interfaces";

import ThemeToggleLogin from "@/components/auth/ThemeToggleLogin";
import Modal from "@/components/Modal";
import ToastStyles from "@/styles/ToastStyles";
import ProductImgUpload from "@/components/admin/ProductImgUpload";
import AddProduct from "@/components/admin/AddProduct";

const ManageCategoryProducts = ({ params }: { params: Promise<{ categoryId: string }> }) => {
  const unwrappedParams = React.use(params);
  const { categoryId } = unwrappedParams;
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [onlySale, setOnlySale] = useState<boolean>(false);
  
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<ProductInterface | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductInterface | null>(null);
  
  
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Queries
  const { data: category, isLoading: isCategoryLoading } = useGetCategoryByIdQuery(categoryId);
  const { data: productsData, isLoading: isProductsLoading } = useGetProductsByCategoryQuery(categoryId);
  
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  

  // Loading state
  if (isCategoryLoading || isProductsLoading) {
    return (
      <div className="h-screen grid place-content-center bg-base-300">
        <span className="loading loading-spinner text-accent loading-xl"></span>
      </div>
    );
  }

  // Filter products
  let filteredProducts = productsData?.products || [];
  
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

  const handleUpdateProduct = async (formData: FormData) => {
    if (!productToEdit) return;
    
    setIsUpdating(true);
    
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
      }).unwrap();
      
      toast.success("Product updated successfully", ToastStyles);
      setIsEditProductModalOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product", ToastStyles);
    } finally {
      setIsUpdating(false);
      setProductToEdit(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    
    try {
      await deleteProduct({
        categoryId,
        productId: String(productToDelete._id)
      }).unwrap();
      
      toast.success("Product deleted successfully", ToastStyles);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product", ToastStyles);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const openEditModal = (product: ProductInterface) => {
    setProductToEdit(product);
    setIsEditProductModalOpen(true);
  };

  const openDeleteModal = (product: ProductInterface) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <ToastContainer />
      
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
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name or description"
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
          </div>
          
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="btn btn-primary"
          >
            <FaPlus className="mr-2" />
            Add Product
          </button>
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
                        <span className="text-accent">${product.salePrice}</span>
                        <span className="text-sm line-through opacity-60">${product.price}</span>
                      </div>
                    ) : (
                      <span>${product.price}</span>
                    )}
                  </div>
                  <div className="badge badge-outline">Stock: {product.stock}</div>
                </div>
                
                {product.description && (
                  <p className="text-sm line-clamp-2 mb-2">{product.description}</p>
                )}
                
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.sizes.map((size, index) => (
                      <span key={index} className="badge badge-sm badge-outline">
                        {size}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="card-actions justify-between mt-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="btn btn-sm btn-primary flex-1"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(product)}
                    className="btn btn-sm btn-error flex-1"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
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
            <button 
              onClick={() => setIsAddProductModalOpen(true)}
              className="btn btn-primary mt-4"
            >
              <FaPlus className="mr-2" /> Add your first product
            </button>
          </div>
        )}
      </div>

      <AddProduct category={category!} isAddProductModalOpen={isAddProductModalOpen} setIsAddProductModalOpen={setIsAddProductModalOpen} />

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
                <span className="label-text">Meta Keywords (comma separated)</span>
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
              disabled={isUpdating}
            >
              {isUpdating ? (
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

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <Modal
          IsOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          title="Delete Product"
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
              Are you sure you want to delete product:{" "}
              <span className="font-bold">{productToDelete.name}</span>?
            </p>
            <p className="text-center text-gray-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
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
      )}
    </div>
  );
};

export default ManageCategoryProducts;