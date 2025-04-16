import React from "react";
import { Image } from "@imagekit/next";
import { ProductInterface } from "@/Interfaces";
import Link from "next/link";
import AddToCartBtn from "./AddToCartBtn";

const ProductCard = ({ product }: { product: ProductInterface }) => {
  const productUrl = `/categories/${String(product.categoryId)}/${String(
    product._id
  )}`;
  return (
    <div className="w-full block px-2">
      {/* <ToastContainer /> */}
      <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 group relative">
        {/* Image container */}
        <figure className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-base-200 flex items-center justify-center">
              <span className="text-base-content/40">No image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.isOnSale && <div className="badge badge-error">SALE</div>}
          </div>
        </figure>

        {/* Product details */}
        <div className="card-body p-4">
          <Link href={productUrl}>
            <h3 className="card-title text-lg truncate hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center mt-1">
            {product.isOnSale && product.salePrice ? (
              <>
                <span className="text-primary font-bold">
                  ${product.salePrice.toFixed(2)}
                </span>
                <span className="ml-2 text-base-content/50 line-through text-sm">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-primary font-bold">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="card-actions justify-between mt-3">
            <Link href={productUrl} className="btn btn-sm btn-outline">
              Details
            </Link>
            <AddToCartBtn product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;