"use client";

import { useAddToCartMutation } from "@/app/services/UserData";
import MutationStateHandler from "@/components/MutationStateHandler";
import { ProductInterface } from "@/Interfaces";
import ToastStyles from "@/styles/ToastStyles";
import React from "react";
import { toast } from "react-toastify";

const AddToCartBtn = ({ product, size = null, btnSize = "md" }: { product: ProductInterface, size?: string | null, btnSize?: string }) => {
  const [
    addToCart,
    {
      isLoading: isLoadingAdd,
      isError: isErrorAdd,
      isSuccess: isSuccessAdd,
      error: errorAdd,
    },
  ] = useAddToCartMutation();

  const handleAdd = async () => {
    try {
      await addToCart({productid: String(product._id), size: size || product.sizes![0] || "S"});
    } catch (error) {
      console.error("Could not add the item to cart", error);
      toast.error("Could not add the item to cart", ToastStyles);
    }
  };

  return (
    <>
      <MutationStateHandler
        isError={isErrorAdd}
        isSuccess={isSuccessAdd}
        error={errorAdd}
        SuccessMessage="Item Added To Cart"
      />
      <button
        onClick={handleAdd}
        disabled={isLoadingAdd}
        className={`btn btn-${btnSize} btn-primary`}
      >
        {isLoadingAdd ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Adding Item...
          </>
        ) : (
          "Add To Cart"
        )}
      </button>
    </>
  );
};

export default AddToCartBtn;
