import { categoriesApi } from "@/app/services/CategoryData";
import { productsApi } from "@/app/services/ProductData";
import { usersApi } from "@/app/services/UserData";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const ReduxStore = configureStore({
    reducer: {
        [usersApi.reducerPath]: usersApi.reducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
    },

    // caching
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware().concat(usersApi.middleware,categoriesApi.middleware,productsApi.middleware)
    ),
});

setupListeners(ReduxStore.dispatch);

export type RootState = ReturnType<typeof ReduxStore.getState>
export type AppDispatch = typeof ReduxStore.dispatch