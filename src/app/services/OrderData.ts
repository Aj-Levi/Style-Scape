import { OrderInterface } from "@/Interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "orders",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getAllOrders: builder.query<OrderInterface[], void>({
      query: () => `/api/orders`,
      providesTags: ["Order"],
    }),

    getAllUserOrders: builder.query<OrderInterface[], void>({
      query: () => `/api/orders/userOrders`,
      providesTags: ["Order"],
    }),

    getOrderById: builder.query<OrderInterface, string>({
      query: (orderId) => `/api/orders/userOrders/${orderId}`,
      providesTags: (result, error, orderid) => [{type: "Order", id: orderid}, "Order"],
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
      invalidatesTags: ["Order"],
    }),

    cancelOrder: builder.mutation<{message: string}, string>({
      query: (orderid) => ({
        url: `/api/orders/userOrders/${orderid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, orderid) => ["Order", {type: "Order", id: orderid}]
    }),

    markOrderAsDelivered: builder.mutation<{ message: string }, string>({
      query: (orderid) => ({
        url: `/api/orders/userOrders/${orderid}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: {},
      }),
      invalidatesTags: (result, error, orderid) => ["Order", {type: "Order", id: orderid}]
    }),
  }),
});

export const {
  useAddOrderMutation,
  useGetOrderByIdQuery,
  useGetAllUserOrdersQuery,
  useGetAllOrdersQuery,
  useMarkOrderAsDeliveredMutation,
  useCancelOrderMutation
} = ordersApi;
