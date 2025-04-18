import mongoose, { Document, ObjectId } from "mongoose";
import { ReactNode } from "react";

export interface ZustandStoreInterface{
    currentTheme: string;
    toggleTheme: ()=>void;

    isSidebarOpen: boolean;
    toggleSidebar: ()=>void;
}

export interface UserInterface extends Document{
    _id: ObjectId | string;
    firstname: string;
    lastname?: string;
    email: string;
    password: string;
    role: 'user'|'admin';
    image?: string;
    phone?: string;
    address?: string;
    cartitems?: OrderItemInterface[];
    orders?: (string | ObjectId | OrderInterface)[];
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

export interface ReviewInterface extends Document {
    _id: string;
    user: string | ObjectId | UserInterface;
    rating: number;
    comment?: string;
    createdAt: string;
}

export interface UpdatedReviewInterface {
    reviewId: string;
    rating?: number;
    comment?: string;
}

export interface AddReviewInterface {
    rating: number;
    comment?: string;
}

export interface ProductInterface extends Document {
    _id: string;
    name: string;
    description?: string;
    price: number;
    salePrice?: number;
    category?: string;
    categoryId: string;
    stock: number;
    images?: string[];
    isFeatured: boolean;
    isOnSale: boolean;
    sizes?: string[];
    metatitle?: string;
    metadesc?: string;
    metakeywords?: string[];
    reviews?: (string | ObjectId | ReviewInterface)[];
    rating: number;
}

export interface UpdatedProductInterface {
    name?: string;
    description?: string;
    price?: number;
    salePrice?: number;
    category?: string;
    categoryId?: string;
    stock?: number;
    images?: string[];
    isFeatured?: boolean;
    isOnSale?: boolean;
    sizes?: string[];
    metatitle?: string;
    metadesc?: string;
    metakeywords?: string[];
}

export interface AddProductInterface {
    name: string;
    description?: string;
    price: number;
    salePrice?: number;
    category?: string;
    categoryId: string;
    stock: number;
    images?: string[];
    isFeatured?: boolean;
    isOnSale?: boolean;
    sizes?: string[];
    metatitle?: string;
    metadesc?: string;
    metakeywords?: string[];
}

export interface OrderItemInterface{
    product: string | ObjectId | ProductInterface;
    size: string,
    quantity: number;
    totalProductPrice?: number;
}

export interface paymentResultInterface{
    id?: String;
    status?: string;
    update_time?: string;
    email_address?: string;
}

export interface OrderInterface extends Document{
    _id: string;
    customer: string | ObjectId | UserInterface;
    items?: OrderItemInterface[];
    status: string;
    shippingAddress: string;
    contactNumber: string;
    totalOrderPrice: number;
    shippingPrice: number;
    paymentMethod: string;
    paymentResult?: paymentResultInterface;
    isDelivered: boolean;
    deliveredAt?: string;
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