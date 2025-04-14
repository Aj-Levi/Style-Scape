import React, { useState } from 'react'
import Modal from '../Modal'
import { useAddProductMutation } from '@/app/services/ProductData';
import { AddProductInterface, CategoryInterface } from '@/Interfaces';
import { toast } from 'react-toastify';
import ToastStyles from '@/styles/ToastStyles';

const AddProduct = ({category,isAddProductModalOpen,setIsAddProductModalOpen }: {category: CategoryInterface, isAddProductModalOpen: boolean,setIsAddProductModalOpen: (val: boolean) => void }) => {

    
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [addProduct] = useAddProductMutation();

    const handleAddProduct = async (formData: FormData) => {
        setIsAdding(true);
        
        try {
          const newProduct: AddProductInterface = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            price: Number(formData.get("price")),
            salePrice: formData.get("salePrice") ? Number(formData.get("salePrice")) : undefined,
            category: category?.name,
            categoryId: String(category?._id),
            stock: Number(formData.get("stock")),
            isFeatured: formData.get("isFeatured") === "on",
            isOnSale: formData.get("isOnSale") === "on",
            sizes: formData.get("sizes") ? (formData.get("sizes") as string).split(",").map(size => size.trim()) : [],
            metatitle: formData.get("metatitle") as string,
            metadesc: formData.get("metadesc") as string,
            metakeywords: formData.get("metakeywords") ? 
              (formData.get("metakeywords") as string).split(",").map(keyword => keyword.trim()) : [],
          };
    
          const response = await addProduct(newProduct).unwrap();
          if (response.success) {
            toast.success("Product added successfully", ToastStyles);
            setIsAddProductModalOpen(false);
          } else {
            toast.error(response.message, ToastStyles);
          }
        } catch (error) {
          console.error("Error adding product:", error);
          toast.error("Failed to add product", ToastStyles);
        } finally {
          setIsAdding(false);
        }
      };
    
  return (

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
          <span className="label-text">Meta Keywords (comma separated)</span>
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
        disabled={isAdding}
      >
        {isAdding ? (
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
  )
}

export default AddProduct