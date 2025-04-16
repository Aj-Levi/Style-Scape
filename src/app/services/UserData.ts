import { AddUserInterface, OrderItemInterface, UpdatedUserInterface, UserInterface } from "@/Interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["User", "CartItems"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<UserInterface[], void>({
      query: () => "api/users",
      providesTags: ["User"],
    }),

    getUserById: builder.query<UserInterface, string>({
      query: (id) => `api/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    addUser: builder.mutation<{ message: string },AddUserInterface>({
      query: (user) => ({
        url: `/api/users`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: user,
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation<{message: string},{ id: string; updatedUser: UpdatedUserInterface }>({
      query: ({ id, updatedUser }) => ({
        url: `api/users/${id}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedUser,
      }),

      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User" },
      ],
    }),

    deleteUser: builder.mutation<{message: string}, string>({
      query: (id) => ({
        url: `api/users/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error,id ) => [
        { type: "User", id },
        { type: "User" },
      ],
    }),

    getCartItems: builder.query<OrderItemInterface[],void>({
      query: () => `/api/cart`,
      providesTags: ["CartItems"],
    }),

    addToCart: builder.mutation<{message: string}, {productid: string, size: string}>({
      query: ({productid, size}) => ({
        url: `/api/cart/${productid}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {size: size},
      }),

      invalidatesTags: ["CartItems"],
    }),

    removeFromCart: builder.mutation<{message: string}, {productid: string, size: string}>({
      query: ({productid, size}) => ({
        url: `api/cart/${productid}`,
        method: "DELETE",
        body: {size: size},
      }),

      invalidatesTags: ["CartItems"],
    })
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAddUserMutation,
  useAddToCartMutation,
  useGetCartItemsQuery,
  useRemoveFromCartMutation,
} = usersApi;
