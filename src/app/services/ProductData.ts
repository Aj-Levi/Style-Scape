import { AddProductInterface, AddReviewInterface, ProductInterface, ReviewInterface, UpdatedProductInterface, UpdatedReviewInterface } from "@/Interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export const productsApi = createApi({
  reducerPath: "products",
  baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
  tagTypes: ["Product", "ProductReview"],
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

    getProductReviews: builder.query<ReviewInterface[],string>({
      query: (productid) => `/api/reviews/${productid}`,
      providesTags: (result, error, productid) => [{type: "ProductReview", id: productid}]
    }),

    getProductUserReviews: builder.query<ReviewInterface[],string>({
      query: (productid) => `/api/reviews/${productid}/userReview`,
      providesTags: (result, error, productid) => [{type: "ProductReview", id: productid}]
    }),

    addProductReview: builder.mutation<{message: string}, {productid: string, review: AddReviewInterface}>({
      query: ({productid, review}) => ({
        url: `/api/reviews/${productid}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: review,
      }),
      invalidatesTags: (result, error, {productid}) => [{type: "ProductReview", id: productid}, { type: "Product", id: productid }]
    }),

    updateProductReview: builder.mutation<{message: string},{productid: string, updatedReview: UpdatedReviewInterface}>({
      query: ({ productid, updatedReview }) => ({
        url: `/api/reviews/${productid}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedReview,
      }),
      invalidatesTags: (result, error, {productid}) => [{type: "ProductReview", id: productid}, { type: "Product", id: productid }]
    }),

    deleteProductReview: builder.mutation<{message: string}, {productid: string, id: {reviewId: string}}>({
      query: ({ productid, id }) => ({
        url: `/api/reviews/${productid}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: (result, error, {productid}) => [{type: "ProductReview", id: productid}, { type: "Product", id: productid }]
    })
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
  useGetProductReviewsQuery,
  useGetProductUserReviewsQuery,
  useAddProductReviewMutation,
  useUpdateProductReviewMutation,
  useDeleteProductReviewMutation,
} = productsApi;