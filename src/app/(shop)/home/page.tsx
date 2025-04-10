import BrandsMarque from '@/components/shop/Home/BrandsMarque'
import HeroSection from '@/components/shop/Home/HeroSection'
import React from 'react'

const Home = async () => {  
  return (
    <div className='w-screen py-[0rem]'>
      <HeroSection />
      <BrandsMarque />
    </div>
  )
}

export default Home