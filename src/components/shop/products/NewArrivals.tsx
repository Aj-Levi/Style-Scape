"use client";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useGetNewArrivalsQuery } from "@/app/services/ProductData";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "./ProductCard";
import QueryStateHandler from "@/components/QueryStateHandler";

interface NewArrivalsProps {
  title?: string;
}

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const NewArrivals = ({ title = "New Arrivals" }: NewArrivalsProps) => {
  const { data, isLoading, isError, error } = useGetNewArrivalsQuery();

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
    customPaging: (_: number) => (
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
        <div className="alert alert-info shadow-lg max-w-3xl mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current flex-shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>No new arrivals available</span>
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
      <div id="new-arrivals" className="w-full py-8 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
          {title}
        </h2>

        <div className="slider-container px-4 relative">
          <Slider {...settings}>
            {data.map((product) => (
              <div key={String(product._id)} className="px-2">
                <div className="relative">
                  <span className="badge badge-secondary absolute top-2 left-2 z-10">
                    NEW
                  </span>
                  <ProductCard product={product} />
                </div>
              </div>
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

export default NewArrivals;
