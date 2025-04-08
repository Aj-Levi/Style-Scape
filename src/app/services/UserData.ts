import { UpdatedUserInterface, UserInterface } from "@/Interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<UserInterface[], void>({
      query: () => "api/users",
      providesTags: ["User"],
    }),

    getUserById: builder.query<UserInterface, string>({
      query: (id) => `api/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    addUser: builder.mutation<
      { success: boolean; message: string },
      UpdatedUserInterface
    >({
      query: (user) => ({
        url: `/api/users`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: user,
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation<
      string,
      { id: string; updatedUser: UpdatedUserInterface }
    >({
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

    deleteUser: builder.mutation<string, string>({
      query: (id) => ({
        url: `api/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAddUserMutation,
} = usersApi;
