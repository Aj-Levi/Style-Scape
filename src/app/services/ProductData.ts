import { AddProductInterface, ProductInterface, UpdatedProductInterface } from "@/Interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "products",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getAllProducts: builder.query<ProductInterface[], void>({
      query: () => "api/products",
      providesTags: ["Product"],
    }),

    getProductsByCategory: builder.query<ProductInterface[],string>({
      query: (categoryId) => `api/products/${categoryId}`,
      providesTags: (result, error) => ["Product"],
    }),

    getProductById: builder.query<ProductInterface,{ categoryId: string; productId: string }>({
      query: ({ categoryId, productId }) => 
        `api/products/${categoryId}/${productId}`,
      providesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    getFeaturedProducts: builder.query<ProductInterface[], void>({
      query: () => `api/featuredProducts`,
      providesTags: ["Product"],
    }),

    getNewArrivals: builder.query<ProductInterface[], void>({
      query: () => `api/newArrivals`,
      providesTags: ["Product"],
    }),

    addProduct: builder.mutation<{ message: string; },AddProductInterface>({
      query: (product) => ({
        url: `/api/products`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<{ message: string; },{ categoryId: string; productId: string; updatedProduct: UpdatedProductInterface }>({
      query: ({ categoryId, productId, updatedProduct }) => ({
        url: `api/products/${categoryId}/${productId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedProduct,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        "Product",
      ],
    }),

    deleteProduct: builder.mutation<{ message: string },{ categoryId: string; productId: string }>({
      query: ({ categoryId, productId }) => ({
        url: `api/products/${categoryId}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { productId }) => ["Product",{ type: "Product", id: productId }],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductByIdQuery,
  useGetFeaturedProductsQuery,
  useGetNewArrivalsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;