import { usersApi } from "@/app/services/UserData";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const ReduxStore = configureStore({
    reducer: {
        [usersApi.reducerPath]: usersApi.reducer,
    },

    // caching
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware().concat(usersApi.middleware)
    ),
});

setupListeners(ReduxStore.dispatch);

export type RootState = ReturnType<typeof ReduxStore.getState>
export type AppDispatch = typeof ReduxStore.dispatch