"use client";

import { CategoryInterface } from "@/Interfaces";
import React from "react";
import { Image } from "@imagekit/next";
import { useRouter } from "next/navigation";

const CategoryCard = ({ category }: { category: CategoryInterface }) => {
  const router = useRouter();

  return (
    <div className="px-2 py-2 h-full">
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
        {category.isfeatured && (
          <div className="badge badge-accent absolute top-2 right-2 z-10 font-semibold">
            Featured
          </div>
        )}
        <figure className="h-48 overflow-hidden">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              width={400}
              height={300}
              className="w-full h-full object-cover hover:scale-110 transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full bg-base-200 flex items-center justify-center">
              <span className="text-base-content/40">No image</span>
            </div>
          )}
        </figure>
        <div className="card-body p-4">
          <h2 className="card-title text-lg">{category.name}</h2>
          {category.description && (
            <p className="text-sm line-clamp-2">{category.description}</p>
          )}
          <div className="card-actions justify-end mt-4">
            <button
              onClick={() => router.push(`/categories/${String(category._id)}`)}
              className="btn btn-primary btn-sm"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
