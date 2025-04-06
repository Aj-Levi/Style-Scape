import { UserInterface } from "@/Interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  endpoints: (builder) => ({
    getAllUsers: builder.query<UserInterface[], void>({
      query: () => "/users",
    }),

    getProductById: builder.query<UserInterface, string>({
      query: (id) => `/users/${id}`,
    }),

    updateProduct: builder.mutation<string,{id: string, updatedUser: UserInterface}>({
      query: ({id, updatedUser}) => ({
        url: `/users/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: updatedUser,
      }),
    }),

    deleteProduct: builder.mutation<string,string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetAllUsersQuery, useGetProductByIdQuery, useUpdateProductMutation, useDeleteProductMutation } = usersApi;
