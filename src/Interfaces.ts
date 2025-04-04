import { Document } from "mongoose";

export interface ZustandStoreInterface{
    currentTheme: string;
    toggleTheme: ()=>void;
}

export interface UserInterface extends Document{
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: 'user'|'admin';
    image: string;
    authProviderId: string;
}