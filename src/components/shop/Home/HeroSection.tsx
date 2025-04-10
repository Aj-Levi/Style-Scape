"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { poppins } from "@/styles/fonts";
import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CountUpItem from "./CountUpItem";

const carouselImages = [
  { src: '/LoginBG.png', alt: "Fashion collection" },
  { src: '/images/sumercollection.avif', alt: "Summer collection" },
  { src: '/images/SpringCollection.jpeg', alt: "Spring collection" },
];

const HeroSection = () => {

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4200); 

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  return (
    <div className="w-full bg-gradient-to-br from-base-100 to-base-300">
      <div className="container mx-auto py-16 px-4 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Content area */}
        <div className="w-full md:w-1/2 space-y-8">
          {/* Content remains the same */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Discover Fashion
              </span>{" "}
              That Defines You
            </h1>
            <p
              className={`${poppins.className} text-lg text-gray-500 max-w-md`}
            >
              Explore our curated collection of premium clothing designed to
              elevate your style and express your unique personality.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/categories" className="group">
              <button className="btn btn-primary px-8 py-3 flex items-center gap-2 transition-all hover:shadow-lg hover:bg-primary">
                Shop Now
                <FaLongArrowAltRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>
            <Link href="/categories" className="group">
              <button className="btn btn-outline px-8 py-3">
                View Collections
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
            <CountUpItem endValue={200} title="International Brands" />
            <CountUpItem endValue={10000} title="Quality Products" />
            <CountUpItem endValue={70000} title="Happy Customers" />
          </div>
        </div>

        {/* Image carousel area with animation */}
        <div 
          className={`w-full md:w-1/2`}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Carousel */}
            <div className="relative h-[500px]">
              {carouselImages.map((image, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-1200 ${
                    index === currentSlide
                      ? "opacity-100"
                      : "opacity-0 absolute inset-0"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    className="object-cover w-full h-[500px]"
                    width={600}
                    height={700}
                    priority={index === 0}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

              {/* Navigation arrows */}
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
                onClick={prevSlide}
              >
                <FaChevronLeft />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
                onClick={nextSlide}
              >
                <FaChevronRight />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentSlide ? "bg-white" : "bg-white/50"
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
