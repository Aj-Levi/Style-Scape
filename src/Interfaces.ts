import { Document } from "mongoose";
import { ReactNode } from "react";

export interface ZustandStoreInterface{
    currentTheme: string;
    toggleTheme: ()=>void;

    isSidebarOpen: boolean;
    toggleSidebar: ()=>void;
}

export interface UserInterface extends Document{
    firstname: string;
    lastname?: string;
    email: string;
    password: string;
    role: 'user'|'admin';
    image?: string;
    phone?: string;
    address?: string;
    authProviderId: string;
}

export interface UpdatedUserInterface{
    firstname?: string;
    lastname?: string;
    image?: string;
    phone?: string;
    address?: string;
    password?: string;
}

export interface ToastInterface{
    autoClose: number;
    className: string;
}

export interface TabInterface{
    id: string;
    label: string;
    icon: ReactNode;
}