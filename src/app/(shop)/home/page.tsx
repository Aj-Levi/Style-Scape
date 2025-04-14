import FeaturedCategoriesCarousel from '@/components/shop/categories/Carousel'
import FeaturedProductsCarousel from '@/components/shop/products/Carousel'
import BrandsMarque from '@/components/shop/Home/BrandsMarque'
import HeroSection from '@/components/shop/Home/HeroSection'
import React from 'react'
import NewArrivals from '@/components/shop/products/NewArrivals'

const Home = () => {    
  return (
    <div className='w-screen py-[0rem]'>
      <HeroSection />
      <BrandsMarque />
      <FeaturedCategoriesCarousel />
      <FeaturedProductsCarousel />
      <NewArrivals />
    </div>
  )
}

export default Home