"use server";
import { getSession } from '@/lib/getSession';
import { redirect } from 'next/navigation';
import React from 'react'

const AdminLayout = async({children}: {children: React.ReactNode}) => {

  const session = await getSession();
  const user = session?.user;

  if(!user) {
    redirect("/login");
  }

  if(user.role !== "admin") {
    redirect("/home");
  }
  
  return (
    <>{children}</>
  )
}

export default AdminLayout