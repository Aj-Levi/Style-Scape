import HeroSection from '@/components/shop/Home/HeroSection'
import { getSession } from '@/lib/getSession'
import React from 'react'

const Home = async () => {

  // const session = await getSession();
  // console.log("********************");
  // console.log(session);
  // console.log("********************");
  
  return (
    <div className='w-screen py-[0rem]'>
      <HeroSection />
    </div>
  )
}

export default Home