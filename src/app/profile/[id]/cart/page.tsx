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
import ExpandedCheckout from "@/components/shop/orderComp/ExpandedCheckout";
import RemoveFromCart from "@/components/shop/products/RemoveFromCart";
import { ProductInterface } from "@/Interfaces";
import { Image } from "@imagekit/next";
import Link from "next/link";
import React from "react";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";

const Cart = () => {
  const { data: user, isLoading, isError, error } = useGetCartItemsQuery();

  const calculateSubtotal = () => {
    if (!user?.cartitems || user?.cartitems.length === 0) return 0;

    return user?.cartitems.reduce((acc, item) => {
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
                {user?.cartitems?.length || 0} items
              </span>
            </div>

            {user?.cartitems && user?.cartitems.length > 0 ? (
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
                      {(user?.cartitems as CartInterface[]).map((item) => (
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
                              </div>
                            </div>
                          </td>
                          <td>
                            {item.product?.isOnSale &&
                            item.product?.salePrice ? (
                              <div>
                                <span className="font-medium">
                                ₹{item.product.salePrice.toFixed(2)}
                                </span>
                                <span className="text-xs line-through ml-2 text-base-content/50">
                                ₹{item.product.price.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-medium">
                                ₹{item.product?.price?.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="pl-6"> {item.size} </td>
                          <td className="pl-10">{item.quantity}</td>
                          <td className="font-medium">
                          ₹
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

                {/* proceed to checkout component */}
                <ExpandedCheckout subtotal={+calculateSubtotal().toFixed(2)} />
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
