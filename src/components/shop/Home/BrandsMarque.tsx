"use client";

import Image from "next/image";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";

const brands = [
  { id: 1, name: "Nike", logo: "/brands/NikeLogo.webp" },
  { id: 2, name: "Adidas", logo: "/brands/AddidasLogo.png" },
  { id: 3, name: "Gucci", logo: "/brands/GucciLogo.jpg" },
  { id: 4, name: "Prada", logo: "/brands/PradaLogo.jpg" },
  { id: 6, name: "Zara", logo: "/brands/ZaraLogo.jpg" },
  { id: 7, name: "H&M", logo: "/brands/HnMLogo.jpg" },
];

interface BrandsMarqueProps {
  title?: string;
}

const BrandsMarque: React.FC<BrandsMarqueProps> = ({ title = "Our Brands" }) => {
  const router = useRouter();
  
  // React-Slick settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const handleBrandClick = (brandName: string) => {
    router.push(`/products?brand=${brandName}`);
  };

  return (
    <section className="py-8 bg-base-200">
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">{title}</h2>
      )}
      
      <div className="container mx-auto px-4">
        <Slider {...settings}>
          {/* We map brands twice to ensure smooth infinite loop */}
          {[...brands, ...brands].map((brand, index) => (
            <div key={`${brand.id}-${index}`} className="px-4">
              <div 
                className="flex flex-col items-center cursor-pointer" 
                onClick={() => handleBrandClick(brand.name)}
              >
                <div className="w-20 h-20 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-xl mb-3 transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-base-100 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    sizes="(max-width: 640px) 80px, 112px"
                    className="object-cover p-[0.09rem] rounded-full"
                  />
                </div>
                <span className="text-sm font-medium opacity-80 group-hover:opacity-100">{brand.name}</span>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default BrandsMarque;