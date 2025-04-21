"use client";
import React from "react";
import { useGetFeaturedCategoriesQuery } from "@/app/services/CategoryData";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryCard from "./CategoryCard";
import QueryStateHandler from "@/components/QueryStateHandler";

interface CarouselProps {
  title?: string;
}

const Carousel = ({ title = "Featured Categories" }: CarouselProps) => {
  const { data, isLoading, isError, error } = useGetFeaturedCategoriesQuery();

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1800,
    pauseOnHover: true,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
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
    customPaging: () => (
      <div
        className="w-3 h-3 mx-1 rounded-full bg-base-300 hover:bg-primary transition-colors duration-300"
        style={{
          opacity: 0.7,
        }}
      />
    ),
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          {title}
        </h2>
        <div className="alert alert-neutral flex justify-center gap-x-4 shadow-lg max-w-3xl mx-auto">
          <span className="loading loading-spinner loading-md text-primary"></span>
          <span className="text-lg font-semibold text-primary">Loading Featured categories</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <QueryStateHandler
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <div id="featured" className="w-full py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
          {title}
        </h2>

        <div className="slider-container px-4 relative">
          <Slider {...settings}>
            {data.map((category) => (
              <CategoryCard key={String(category._id)} category={category} />
            ))}
          </Slider>
        </div>

        <style jsx global>{`
          .slick-track {
            display: flex !important;
          }
          .slick-slide {
            height: inherit !important;
            display: flex !important;
          }
          .slick-slide > div {
            display: flex;
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
    </>
  );
};

export default Carousel;
