import { Document, ObjectId } from "mongoose";
import { ReactNode } from "react";

export interface ZustandStoreInterface{
    currentTheme: string;
    toggleTheme: ()=>void;

    isSidebarOpen: boolean;
    toggleSidebar: ()=>void;
}

export interface UserInterface extends Document{
    _id: ObjectId;
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
    role?: 'user' | 'admin';
}

export interface AddUserInterface{
    firstname: string;
    lastname?: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
}

export interface CategoryInterface extends Document{
    _id: string;
    name: string;
    isfeatured: boolean;
    image?: string;
    description?: string;
    metatitle?: string;
    metadesc?: string;
    metakeywords?: string[];
}

export interface UpdatedCategoryInterface{
    name?: string;
    isfeatured?: boolean;
    image?: string;
    description?: string;
    metatitle?: string;
    metadesc?: string;
    metakeywords?: string[];
}

export interface AddCategoryInterface{
    name: string;
    isfeatured: boolean;
    image?: string;
    description?: string;
    metatitle?: string;
    metadesc?: string;
    metakeywords?: string[];
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