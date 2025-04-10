"use client";

import React from 'react'

const brands = [
  { id: 1, name: 'Nike', logo: '/brands/NikeLogo.webp' },
  { id: 2, name: 'Adidas', logo: '/brands/AddidasLogo.png' },
  { id: 3, name: 'Gucci', logo: '/brands/GucciLogo.jpg' },
  { id: 4, name: 'Prada', logo: '/brands/PradaLogo.jpg' },
  { id: 6, name: 'Zara', logo: '/brands/ZaraLogo.jpg' },
  { id: 7, name: 'H&M', logo: '/brands/HnMLogo.jpg' },
];

const BrandsMarque = () => {
  const duplicatedBrands = [...brands, ...brands];
  
  return (
    <section className="bg-base-200 overflow-hidden">
      <div className="py-8">        
        <div className="relative w-full overflow-hidden">
          <div 
            className="flex whitespace-nowrap"
            style={{
              animation: 'scroll 40s linear infinite',
              width: 'fit-content'
            }}
          >
            {duplicatedBrands.map((brand, index) => (
              <div key={`${brand.id}-${index}`} className="flex flex-col items-center mx-8">
                <div className="w-20 h-20 flex items-center justify-center bg-white rounded-full shadow-md mb-3 hover:scale-110 transition-transform duration-300">
                  <img src={brand.logo} alt={`${brand.name} logo`} className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default BrandsMarque