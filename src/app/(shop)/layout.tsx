import React, { ReactNode } from 'react'
import Navbar from "@/components/shop/Navbar"
import Sidebar from '@/components/shop/Sidebar'
import Footer from '@/components/shop/Footer'
import { getSession } from '@/lib/getSession'

const ShopLayout = async({children}: {children: ReactNode}) => {
  const session = await getSession();
  const user = session?.user? session.user : null;
  return (
    <>
        <Navbar />
        <Sidebar user={user!} />
        {children}
        <Footer />
    </>
  )
}

export default ShopLayout