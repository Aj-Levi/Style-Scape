import { create } from "zustand";
import { ZustandStoreInterface } from "@/Interfaces";

export const useZustandStore = create<ZustandStoreInterface>((set)=>({
    currentTheme: "abyss",
    toggleTheme: ()=>{set((state)=>{
        return state.currentTheme==="abyss"?{currentTheme: "bumblebee"}:{currentTheme: "abyss"}
    })},
    isSidebarOpen: false,
    toggleSidebar: ()=>{set((state)=>({
        isSidebarOpen: !state.isSidebarOpen
    }))}
}))