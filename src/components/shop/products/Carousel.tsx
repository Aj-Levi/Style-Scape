"use client";
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useGetFeaturedProductsQuery } from '@/app/services/ProductData';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from './ProductCard';

interface CarouselProps {
  title?: string;
}

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Carousel: React.FC<CarouselProps> = ({ title = "Featured Products" }) => {
  const { data, isLoading, error } = useGetFeaturedProductsQuery();
  
  const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => {
    return (
      <button 
        className="btn btn-circle btn-sm btn-ghost bg-base-100/60 absolute left-2 top-1/2 -translate-y-1/2 z-10"
        onClick={onClick}
        aria-label="Previous slide"
      >
        <FaChevronLeft />
      </button>
    );
  };

  const NextArrow: React.FC<ArrowProps> = ({ onClick }) => {
    return (
      <button 
        className="btn btn-circle btn-sm btn-ghost bg-base-100/60 absolute right-2 top-1/2 -translate-y-1/2 z-10"
        onClick={onClick}
        aria-label="Next slide"
      >
        <FaChevronRight />
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1800,
    pauseOnHover: true,
    swipeToSlide: true,
    rtl: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
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

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">{title}</h2>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">{title}</h2>
        <div className="alert alert-error shadow-lg max-w-3xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error loading products. Please try again later.</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">{title}</h2>
        <div className="alert alert-info shadow-lg max-w-3xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>No products available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">{title}</h2>
      
      <div className="slider-container px-4 relative">
        <Slider {...settings}>
          {data.map((product) => (
            <ProductCard key={String(product._id)} product={product} />
          ))}
        </Slider>
      </div>
      
      <style jsx global>{`
        .slick-dots {
          bottom: -35px;
        }
        .slick-dots li button:before {
          font-size: 12px;
        }
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
  );
};

export default Carousel;