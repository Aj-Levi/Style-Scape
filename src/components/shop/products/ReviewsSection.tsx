"use client";

import React from "react";
import ProductReviews from "./ProductReviews";
import UserReviews from "./UserReviews";

const ReviewsSection = ({ productId }: {productId: string;}) => {
  return (
    <div className="mt-16 bg-base-100 p-8 rounded-xl shadow-sm">
      <h2 className="text-3xl font-bold mb-10 text-center">Hear From The Customers</h2>
      <div className="space-y-12">
        <ProductReviews productid={productId} />
        <div className="divider"></div>
        <UserReviews productid={productId} />
      </div>
    </div>
  );
};

export default ReviewsSection;