import React, { ReactNode } from 'react'
import Navbar from "@/components/shop/Navbar"
import Sidebar from '@/components/shop/Sidebar'

const ShopLayout = ({children}: {children: ReactNode}) => {
  return (
    <>
        <Navbar />
        <Sidebar />
        {children}
    </>
  )
}

export default ShopLayout