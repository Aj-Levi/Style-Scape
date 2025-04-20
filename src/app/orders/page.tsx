"use client";

import React from "react";
import { useGetAllUserOrdersQuery } from "../services/OrderData";
import QueryStateHandler from "@/components/QueryStateHandler";
import Link from "next/link";
import ThemeToggleFixed from "@/components/auth/ThemeToggleFixed";
import { useRouter } from "next/navigation";
import CancelOrder from "@/components/shop/orderComp/CancelOrder";

const UserOrders = () => {
  const router = useRouter();

  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useGetAllUserOrdersQuery();

  return (
    <>
      <QueryStateHandler
        isLoading={isLoading}
        isError={isError}
        error={error}
        LoadingFull={true}
      />
      {!isLoading && !isError && orders && (
        <div className="min-h-screen">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={(): void => router.back()}
              className="btn btn-outline mt-4 ml-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Dashboard
            </button>
            <ThemeToggleFixed />
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl underline decoration-2 underline-offset-4 mb-6">
                Order History
              </h2>

              <div className="overflow-x-auto">
                {orders && orders.length > 0 ? (
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="text-primary font-bold">Order ID</th>
                        <th className="text-primary font-bold">Date</th>
                        <th className="text-primary font-bold">Total</th>
                        <th className="text-primary font-bold">Status</th>
                        <th className="text-primary font-bold">Payment</th>
                        <th className="text-primary font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>{order._id}</td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td>₹{order.totalOrderPrice.toFixed(2)}</td>
                          <td>
                            <div
                              className={`badge ${
                                order.status.toLowerCase() === "delivered"
                                  ? "badge-success"
                                  : order.status.toLowerCase() === "shipped"
                                  ? "badge-info"
                                  : "badge-warning"
                              } font-bold`}
                            >
                              {order.status}
                            </div>
                          </td>
                          <td>
                            <div
                              className={`max-md:text-sm badge ${
                                order.isPaid ? "badge-success" : "badge-error"
                              } font-bold`}
                            >
                              {order.isPaid ? "Paid" : "Pending"}
                            </div>
                          </td>
                          <td>
                            <div className="flex gap-x-2 items-center">
                              <Link
                                href={`/orders/${order._id}`}
                                className="btn btn-secondary btn-sm"
                              >
                                View
                              </Link>
                              {!order.isDelivered && (
                                <CancelOrder orderId={String(order._id)} />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xl">No orders found.</p>
                    <p className="text-md text-gray-500">
                      Start shopping to create your first order!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserOrders;
