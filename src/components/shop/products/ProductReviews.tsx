import { useGetProductReviewsQuery } from "@/app/services/ProductData";
import QueryStateHandler from "@/components/QueryStateHandler";
import { ReviewInterface, UserInterface } from "@/Interfaces";
import React from "react";
import { formatDate, renderStars } from "./RatingAccessories";
import { Image } from "@imagekit/next";
import Slider from "react-slick";

const ProductReviews = ({ productid }: { productid: string }) => {
  const {
    data: Reviews,
    isLoading,
    isError,
    error,
  } = useGetProductReviewsQuery(String(productid));

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow:
      Reviews && Reviews.length > 2
        ? 3
        : Reviews && Reviews.length > 0
        ? Reviews.length
        : 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <QueryStateHandler
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <div>

        {Reviews && Reviews.length === 0 && (
          <div className="alert alert-info">
            <div className="flex justify-center w-full">
              <span>No reviews yet. Be the first to review this product!</span>
            </div>
          </div>
        )}

        {Reviews && Reviews.length > 0 && (
          <Slider {...sliderSettings} className="review-slider">
            {Reviews.map((review: ReviewInterface) => (
              <div key={String(review._id)} className="px-2">
                <div className="bg-base-200 p-6 rounded-lg shadow-md h-full flex flex-col">
                  <div className="flex items-center gap-x-2 mb-4">
                    {review.user &&
                      typeof review.user !== "string" && (
                        <div className="avatar mr-3">
                          <div className="w-12 h-12 rounded-full border-2 border-accent overflow-hidden">
                            <Image
                              src={
                                (review.user as UserInterface).image ||
                                "/AccountFallback.png"
                              }
                              alt="User"
                              width={44}
                              height={44}
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                    <div className="flex flex-col justify-center">
                        <div className="flex">{renderStars(review.rating)}</div>
                      <p className="font-medium">
                        {review.user && typeof review.user !== "string"
                          ? `${(review.user as UserInterface).firstname} ${
                              (review.user as UserInterface).lastname
                            }`
                          : "Anonymous"}
                      </p>
                    </div>
                  </div>

                  <p className="text-base-content/80 mb-4 flex-grow">
                    {review.comment}
                  </p>

                  <div className="text-sm text-base-content/70 mt-auto">
                    {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </>
  );
};

export default ProductReviews;
