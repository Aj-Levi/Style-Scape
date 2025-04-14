import React from "react";
import { Image } from "@imagekit/next";
import { ProductInterface } from "@/Interfaces";
import Link from "next/link";

const ProductCard = ({ product }: { product: ProductInterface }) => {
  return (
    <Link
      href={`/categories/${String(product.categoryId)}/${String(product._id)}`}
      className="w-full block px-2"
    >
      <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300">
        <figure className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-base-200 flex items-center justify-center">
              <span className="text-base-content/40">No image</span>
            </div>
          )}
          {product.isOnSale && (
            <div className="badge badge-error absolute top-2 right-2">SALE</div>
          )}
        </figure>
        <div className="card-body p-4">
          <h3 className="card-title text-lg truncate">{product.name}</h3>
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
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
