import React from "react";
import { useGetProductUserReviewsQuery } from "@/app/services/ProductData";
import QueryStateHandler from "@/components/QueryStateHandler";
import { formatDate, renderStars } from "./RatingAccessories";
import EditReview from "./EditReview";
import DeleteReview from "./DeleteReview";
import AddReview from "./AddReview";
import { Image } from "@imagekit/next";
import { UserInterface } from "@/Interfaces";

const UserReviews = ({ productid }: { productid: string }) => {
  const {
    data: userReviews,
    isLoading,
    isError,
    error,
  } = useGetProductUserReviewsQuery(productid);

  return (
    <>
      <QueryStateHandler
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      <div className="mb-4">
        <div className="flex justify-between my-8">
          <h3 className="text-2xl font-semibold pl-4 underline text-center">
            Your Reviews
          </h3>

          <div>
            <AddReview productid={productid} />
          </div>
        </div>

        {userReviews && userReviews.length > 0 ? (
          <div
            className="flex overflow-x-auto pb-6 space-x-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "thin" }}
          >
            {userReviews.map((review) => (
              <div
                key={String(review._id)}
                className="bg-base-200 p-6 rounded-lg shadow-md snap-center min-w-[300px] md:min-w-[400px] flex-shrink-0"
              >
                <div className="flex items-center gap-x-2 mb-4">
                  {review.user && typeof review.user !== "string" && (
                    <div className="avatar mr-3">
                      <div className="w-12 h-12 rounded-full border-2 border-accent overflow-hidden">
                        <Image
                          src={
                            (review.user as UserInterface).image ||
                            "/AccountFallback.png"
                          }
                          alt="Your profile"
                          width={44}
                          height={44}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <div className="flex mb-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-base-content/70">
                      Added on {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>

                <p className="text-base-content/80 mb-6">{review.comment}</p>

                <div className="flex space-x-2 justify-end">
                  <EditReview productid={productid} review={review} />
                  <DeleteReview productid={productid} review={review} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            <div className="flex justify-center w-full">
              <span>You haven't added any reviews yet</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserReviews;
