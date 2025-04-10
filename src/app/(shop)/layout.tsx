import React, { ReactNode } from 'react'
import Navbar from "@/components/shop/Navbar"
import Sidebar from '@/components/shop/Sidebar'
import Footer from '@/components/shop/Footer'

const ShopLayout = ({children}: {children: ReactNode}) => {
  return (
    <>
        <Navbar />
        <Sidebar />
        {children}
        <Footer />
    </>
  )
}

export default ShopLayout