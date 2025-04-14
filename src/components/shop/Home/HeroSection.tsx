"use client";
import Image from "next/image";
import React from "react";
import { poppins } from "@/styles/fonts";
import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CountUpItem from "./CountUpItem";

const carouselImages = [
  { src: "/LoginBG.png", alt: "Fashion collection" },
  { src: "/images/sumercollection.avif", alt: "Summer collection" },
  { src: "/images/SpringCollection.jpeg", alt: "Spring collection" },
];

const HeroSection = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    fade: true,
    arrows: true,
    pauseOnHover: true,
    customPaging: () => (
      <div className="w-2 h-2 rounded-full bg-white/50 hover:bg-white"></div>
    ),
  };

  return (
    <div className="w-full bg-gradient-to-br from-base-100 to-base-300">
      <div className="container mx-auto py-16 px-4 flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 space-y-8">
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
            <Link href="#featured" className="group">
              <button className="btn btn-primary px-8 py-3 flex items-center gap-2 transition-all duration-600 hover:shadow-lg hover:bg-primary">
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

        <div className="w-full md:w-1/2">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="h-[500px] slick-container">
              <Slider {...sliderSettings}>
                {carouselImages.map((image, index) => (
                  <div key={index} className="relative h-[500px]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      className="object-cover w-full h-[500px]"
                      width={600}
                      height={700}
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                ))}
              </Slider>
            </div>
            <style jsx global>{`
              .slick-container .slick-prev,
              .slick-container .slick-next {
                z-index: a10;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 50%;
                width: 30px;
                height: 30px;
              }

              .slick-container .slick-prev:hover,
              .slick-container .slick-next:hover {
                background: rgba(0, 0, 0, 0.5);
              }

              .slick-container .slick-dots {
                bottom: 0px;
              }

              .slick-container .slick-dots li button:before {
                display: none;
              }

              .slick-container .slick-dots li {
                margin: 0 3px;
              }

              .slick-container .slick-dots li.slick-active div {
                background: white;
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
