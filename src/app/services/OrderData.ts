import { OrderInterface } from "@/Interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "orders",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => ({

    getOrderById: builder.query<OrderInterface, string>({
      query: (orderId) => `/api/orders/userOrders/${orderId}`
    }),

    addOrder: builder.mutation<
      { order_ID: string },
      { contactNumber: string; shippingAddress: string; paymentMethod: string }
    >({
      query: (orderDetails) => ({
        url: `/api/orders`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: orderDetails,
      }),
    }),
  }),
});

export const {useAddOrderMutation, useGetOrderByIdQuery} = ordersApi
