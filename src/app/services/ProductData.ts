import { CartInterface, ProductInterface, UpdatedProductInterface } from "@/Interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "products",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Product", "FeaturedProduct", "CategoryProduct", "NewArrivals", "CartItem"],
  endpoints: (builder) => ({
    getAllProducts: builder.query<ProductInterface[], void>({
      query: () => "api/products",
      providesTags: ["Product"],
    }),

    getProductsByCategory: builder.query<
      ProductInterface[],
      string
    >({
      query: (categoryId) => `api/products/${categoryId}`,
      providesTags: (result, error, categoryId) => [
        { type: "CategoryProduct", id: categoryId },
        "Product",
      ],
    }),

    getProductById: builder.query<
      { success: boolean; product: ProductInterface },
      { categoryId: string; productId: string }
    >({
      query: ({ categoryId, productId }) => 
        `api/products/${categoryId}/${productId}`,
      providesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    getFeaturedProducts: builder.query<ProductInterface[], void>({
      query: () => `api/featuredProducts`,
      providesTags: ["FeaturedProduct"],
    }),

    getNewArrivals: builder.query<ProductInterface[], void>({
      query: () => `api/newArrivals`,
      providesTags: ["NewArrivals"],
    }),

    addProduct: builder.mutation<
      { success: boolean; message: string; product: ProductInterface },
      Partial<ProductInterface>
    >({
      query: (product) => ({
        url: `/api/products`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: product,
      }),
      invalidatesTags: ["Product", "FeaturedProduct", "CategoryProduct", "NewArrivals"],
    }),

    updateProduct: builder.mutation<
      { success: boolean; message: string; product: ProductInterface },
      { categoryId: string; productId: string; updatedProduct: UpdatedProductInterface }
    >({
      query: ({ categoryId, productId, updatedProduct }) => ({
        url: `api/products/${categoryId}/${productId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedProduct,
      }),
      invalidatesTags: (result, error, { categoryId, productId }) => [
        { type: "Product", id: productId },
        { type: "CategoryProduct", id: categoryId },
        "Product",
        "FeaturedProduct",
        "NewArrivals",
      ],
    }),

    deleteProduct: builder.mutation<
      { success: boolean; message: string },
      { categoryId: string; productId: string }
    >({
      query: ({ categoryId, productId }) => ({
        url: `api/products/${categoryId}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        "Product",
        "FeaturedProduct",
        "NewArrivals",
        { type: "CategoryProduct", id: categoryId },
      ],
    }),

    getCartItems: builder.query<CartInterface[],void>({
      query: () => ({
        url: `api/cart`,
        method: "GET",
      }),
      providesTags: ["CartItem"],
    }),

    deleteProductFromCart: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (productId) => ({
        url: `api/cart/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags:[
        "CartItem"
      ],
    }),

    AddToCart: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (productId) => ({
        url: `api/cart/${productId}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {},
      }),
      invalidatesTags:[
        "CartItem"
      ],
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
  useAddToCartMutation,
  useDeleteProductFromCartMutation,
  useGetCartItemsQuery,
} = productsApi;