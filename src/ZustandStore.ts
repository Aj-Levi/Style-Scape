import { create } from "zustand";
import { ZustandStoreInterface } from "./Interfaces";

export const useZustandStore = create<ZustandStoreInterface>((set)=>({
    currentTheme: "synthwave",
    toggleTheme: ()=>{set((state)=>{
        return state.currentTheme==="synthwave"?{currentTheme: "bumblebee"}:{currentTheme: "synthwave"}
    })}
}))