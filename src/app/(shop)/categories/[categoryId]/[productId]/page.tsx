"use client";

import { useGetProductByIdQuery } from "@/app/services/ProductData";
import QueryStateHandler from "@/components/QueryStateHandler";
import React, { useState } from "react";
import { Image } from "@imagekit/next";
import { FaArrowLeft } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
import AddToCartBtn from "@/components/shop/products/AddToCartBtn";
import ReviewsSection from "@/components/shop/products/ReviewsSection";
import { renderStars } from "@/components/shop/products/RatingAccessories";

const ProductDetails = ({
  params,
}: {
  params: Promise<{ categoryId: string; productId: string }>;
}) => {
  const unwrappedParams = React.use(params);
  const { categoryId, productId } = unwrappedParams;
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { data: product, isLoading, isError, error } = useGetProductByIdQuery({
    categoryId: String(categoryId),
    productId: String(productId),
  });

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: function(i: number) {
      return (
        <div className="mt-4">
          {product?.images && product.images[i] && (
            <div className="w-16 h-16 rounded border-2 hover:border-primary border-transparent overflow-hidden">
              <Image
                src={product.images[i]}
                alt={`${product.name} thumbnail ${i+1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <>
      <QueryStateHandler
        isError={isError}
        isLoading={isLoading}
        error={error}
        LoadingFull={true}
      />

      {product && (
        <div className="bg-base-100 py-8">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="btn btn-sm btn-ghost gap-2"
              >
                <FaArrowLeft /> Back
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Product Images */}
              <div className="bg-base-200 rounded-lg overflow-hidden shadow-lg">
                {product.images && product.images.length > 0 ? (
                  <div className="product-slider">
                    <Slider {...sliderSettings}>
                      {product.images.map((image, index) => (
                        <div key={index} className="aspect-square relative">
                          <Image
                            src={image}
                            alt={`${product.name} image ${index + 1}`}
                            width={600}
                            height={600}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  <div className="aspect-square flex items-center justify-center bg-base-300">
                    <span className="text-base-content/40 text-xl">
                      No image available
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {product.isFeatured && (
                    <div className="badge badge-secondary">Featured</div>
                  )}
                  {product.isOnSale && (
                    <div className="badge badge-error text-white font-bold ml-2">
                      Sale
                    </div>
                  )}
                </div>

                <div className="flex items-end gap-3">
                  {product.isOnSale && product.salePrice ? (
                    <>
                      <span className="text-2xl font-bold text-primary">
                        ${product.salePrice.toFixed(2)}
                      </span>
                      <span className="text-lg line-through text-base-content/50">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="badge badge-error text-white font-bold ml-2">
                        Save ${(product.price - product.salePrice).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`badge ${
                      product.stock > 0 ? "badge-success" : "badge-error"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </div>
                  {product.stock > 0 && (
                    <span className="text-sm text-base-content/70">
                      only {product.stock} left in stock1
                    </span>
                  )}
                </div>

                <div className="flex gap-x-1">
                  {renderStars(product.rating)}
                </div>

                {product.description && (
                  <div className="py-4">
                    <h3 className="text-lg font-bold underline mb-2">
                      Description
                    </h3>
                    <p className="text-base-content/80">
                      {product.description}
                    </p>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="py-4">
                    <h3 className="text-lg font-semibold mb-2">Select Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <button
                          key={index}
                          className={`btn btn-outline ${
                            selectedSize === size ? "btn-primary" : ""
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6">
                  <AddToCartBtn product={product} size={selectedSize} />
                </div>

                <div className="divider"></div>
                <div className="text-base-content/90">
                  {product.metakeywords && product.metakeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.metakeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="badge badge-accent text-md font-semibold"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* review component */}
            <ReviewsSection productId={productId} />

            <style jsx global>{`
              .product-slider .slick-dots {
                position: relative;
                bottom: 0;
                margin-top: 10px;
                display: flex !important;
                justify-content: center;
                padding: 10px 0;
              }

              .product-slider .slick-dots li {
                width: auto;
                height: auto;
                margin: 0 5px;
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;