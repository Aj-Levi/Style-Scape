"use client";
import React from 'react'
import { useZustandStore } from '@/lib/stores/ZustandStore'
import { IoCloseSharp } from 'react-icons/io5';
import { RiMenuUnfold3Line } from 'react-icons/ri';

const SidebarMenuBtn = () => {
    const {isSidebarOpen , toggleSidebar} = useZustandStore();
  return (
    <button className='z-30 btn btn-accent lg:hidden' onClick={toggleSidebar}>
        {isSidebarOpen?<IoCloseSharp />:<RiMenuUnfold3Line />}
    </button>
  )
}

export default SidebarMenuBtn