import { AddCategoryInterface, UpdatedCategoryInterface, CategoryInterface } from "@/Interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export const categoriesApi = createApi({
  reducerPath: "categories",
  baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
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

    getFeaturedCategories: builder.query<CategoryInterface[], void>({
      query: () => `api/featuredCategories`,
      providesTags: ["Category"],
    }),

    addCategory: builder.mutation<{ message: string },AddCategoryInterface>({
      query: (category) => ({
        url: `/api/categories`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: category,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<{ message: string },{ id: string; updatedCategory: UpdatedCategoryInterface }>({
      query: ({ id, updatedCategory }) => ({
        url: `api/categories/${id}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedCategory,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        "Category",
      ],
    }),

    deleteCategory: builder.mutation<{ message: string },string>({
      query: (id) => ({
        url: `api/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Category", id },
        "Category",
      ],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetFeaturedCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useAddCategoryMutation,
} = categoriesApi;