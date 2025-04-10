import { AddCategoryInterface, UpdatedCategoryInterface, CategoryInterface } from "@/Interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoriesApi = createApi({
  reducerPath: "categories",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getAllCategories: builder.query<CategoryInterface[], void>({
      query: () => "api/categories",
      providesTags: ["Category"],
    }),

    getCategoryById: builder.query<CategoryInterface, string>({
      query: (id) => `api/categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    addCategory: builder.mutation<
      { success: boolean; message: string },
      AddCategoryInterface
    >({
      query: (category) => ({
        url: `/api/categories`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: category,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<
      string,
      { id: string; updatedCategory: UpdatedCategoryInterface }
    >({
      query: ({ id, updatedCategory }) => ({
        url: `api/categories/${id}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedCategory,
      }),

      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        { type: "Category" },
      ],
    }),

    deleteCategory: builder.mutation<string, string>({
      query: (id) => ({
        url: `api/categories/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error,id ) => [
        { type: "Category", id },
        { type: "Category" },
      ],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useAddCategoryMutation,
} = categoriesApi;
