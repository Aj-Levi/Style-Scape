"use client";

import { useRemoveFromCartMutation } from "@/app/services/UserData";
import MutationStateHandler from "@/components/MutationStateHandler";
import React from "react";
import { FiMinusSquare } from "react-icons/fi";
import { toast } from "react-toastify";

const RemoveFromCart = ({ Product_Id, size }: { Product_Id: string, size: string }) => {
  const [
    deleteProductFromCart,
    {
      isLoading: isLoadingDelete,
      isError: isErrorDelete,
      error: errorDelete,
      isSuccess: isSuccessDelete,
    },
  ] = useRemoveFromCartMutation();

  const handleRemoveItem = async (productId: string) => {
    try {
      await deleteProductFromCart({productid: productId, size});
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <>
      <MutationStateHandler
        isError={isErrorDelete}
        isSuccess={isSuccessDelete}
        error={errorDelete}
        SuccessMessage="Item Removed Successfully"
      />
      <button
        className="btn btn-error btn-sm"
        onClick={() => handleRemoveItem(String(Product_Id))}
        disabled={isLoadingDelete}
      >
        {isLoadingDelete ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Removing...
          </>
        ) : (
          <FiMinusSquare size={14} />
        )}
      </button>
    </>
  );
};

export default RemoveFromCart;
