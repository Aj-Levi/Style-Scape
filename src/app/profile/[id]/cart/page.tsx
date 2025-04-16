"use client";

interface CartInterface {
  product: ProductInterface;
  quantity: number;
  size: string;
  totalProductPrice?: number;
}

import {
  useGetCartItemsQuery,
} from "@/app/services/UserData";
import QueryStateHandler from "@/components/QueryStateHandler";
import RemoveFromCart from "@/components/shop/products/RemoveFromCart";
import { ProductInterface } from "@/Interfaces";
import { Image } from "@imagekit/next";
import Link from "next/link";
import React from "react";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";

const Cart = () => {
  const { data: CartItems, isLoading, isError, error } = useGetCartItemsQuery();

  const calculateSubtotal = () => {
    if (!CartItems || CartItems.length === 0) return 0;

    return CartItems.reduce((acc, item) => {
      const product = item.product as ProductInterface;
      const price = product?.salePrice || product?.price || 0;
      return acc + price * item.quantity;
    }, 0);
  };

  return (
    <>
      <QueryStateHandler
        isLoading={isLoading}
        isError={isError}
        error={error}
        LoadingFull={true}
      />

      <div className="col-span-1 md:col-span-3">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h2 className="card-title text-2xl">My Shopping Cart</h2>
              <span className="badge badge-primary">
                {CartItems?.length || 0} items
              </span>
            </div>

            {CartItems && CartItems.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Size</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(CartItems as CartInterface[]).map((item) => (
                        <tr key={String(item.product?._id)+item.size} className="hover">
                          <td>
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 relative rounded overflow-hidden">
                                {item.product?.images &&
                                item.product.images.length > 0 ? (
                                  <Image
                                    src={item.product.images[0]}
                                    alt={item.product?.name || "Product image"}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-base-300 flex items-center justify-center">
                                    <span className="text-sm text-base-content/40">
                                      No image
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <Link
                                  href={`/categories/${String(
                                    item.product?.categoryId
                                  )}/${String(item.product?._id)}`}
                                  className="font-medium hover:text-primary"
                                >
                                  {item.product?.name}
                                </Link>
                                {item.product?.sizes && (
                                  <p className="text-xs text-base-content/60">
                                    Available sizes:{" "}
                                    {item.product.sizes.join(", ")}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            {item.product?.isOnSale &&
                            item.product?.salePrice ? (
                              <div>
                                <span className="font-medium">
                                  ${item.product.salePrice.toFixed(2)}
                                </span>
                                <span className="text-xs line-through ml-2 text-base-content/50">
                                  ${item.product.price.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-medium">
                                ${item.product?.price?.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="pl-6"> {item.size} </td>
                          <td className="pl-10">{item.quantity}</td>
                          <td className="font-medium">
                            $
                            {(
                              (item.product?.salePrice ||
                                item.product?.price ||
                                0) * item.quantity
                            ).toFixed(2)}
                          </td>
                          <td>
                            <RemoveFromCart Product_Id={String(item.product?._id)} size={item.size} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="divider my-6"></div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="w-full md:w-1/2 mx-auto card bg-base-300 p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">
                          ${calculateSubtotal().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span className="font-medium">Free</span>
                      </div>
                      <div className="divider my-2"></div>
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold">
                          ${calculateSubtotal().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <button className="btn btn-primary w-full">
                        Proceed to Checkout
                      </button>
                      <Link href="/home" className="btn btn-outline w-full">
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="flex justify-center mb-6">
                  <FaShoppingCart size={64} className="text-base-content/30" />
                </div>
                <h3 className="text-xl font-bold mb-4">Your cart is empty</h3>
                <p className="text-base-content/70 mb-8 max-w-md mx-auto">
                  Looks like you haven't added any products to your cart yet.
                  Browse our collections and find something you'll love!
                </p>
                <Link href="/home" className="btn btn-primary">
                  <FaArrowLeft className="mr-2" /> Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
