import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

// Function to render stars based on rating
export const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
  }

  for (let i = stars.length; i < 5; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
  }

  return stars;
};

// Function to format date
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const RatingSelector = ({rating, setRating}: {rating: number, setRating: (val: number) => void}) => {
  return (
    <div className="flex items-center space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="focus:outline-none"
        >
          {star <= rating ? (
            <FaStar className="text-yellow-400 text-2xl" />
          ) : (
            <FaRegStar className="text-yellow-400 text-2xl" />
          )}
        </button>
      ))}
      <span className="text-sm text-base-content/70 ml-2">({rating}/5)</span>
    </div>
  );
};

export default RatingSelector;
