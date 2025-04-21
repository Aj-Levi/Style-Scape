"use client";

import { useGetOrderByIdQuery } from "@/app/services/OrderData";
import React from "react";
import { Image } from "@imagekit/next";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";
import {
  OrderItemInterface,
  ProductInterface,
  UserInterface,
} from "@/Interfaces";
import QueryStateHandler from "@/components/QueryStateHandler";
import RazorPayPaymentBtn from "@/components/payment/RazorPayPaymentBtn";
import ThemeToggle from "@/components/shop/buttons/ThemeToggle";
import { BsCash } from "react-icons/bs";

const OrderSummary = ({ params }: { params: Promise<{ orderId: string }> }) => {
  const unwrappedParams = React.use(params);
  const { orderId } = unwrappedParams;
  const router = useRouter();

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useGetOrderByIdQuery(String(orderId));

  return (
    <>
      <QueryStateHandler
        isLoading={isLoading}
        isError={isError}
        error={error}
        LoadingFull={true}
      />
      {!isLoading && !isError && order && (
        <div className="container mx-auto px-4 sm:px-6 py-6 max-w-8xl">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-3 print:hidden">
            <button
              onClick={() => router.back()}
              className="btn btn-sm btn-outline"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>

            <div className="flex items-center gap-x-2 sm:gap-x-4">
              <button
                onClick={() => {
                  window.print();
                }}
                className="btn btn-sm btn-outline"
              >
                <FaPrint className="mr-1" /> Print Receipt
              </button>
              <ThemeToggle />
            </div>
          </div>

          <div className="card bg-base-100 shadow-md mb-6 print:shadow-none">
            <div className="card-body p-4 md:p-6">
              <div className="flex justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Order #{orderId.slice(0, 8)}
                  </h1>
                  <p className="text-sm text-base-content/70">
                    {order?.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`badge flex items-center mb-2 p-3 gap-2 font-semibold ${
                      order?.isDelivered ? "badge-success" : "badge-warning"
                    }`}
                  >
                    <BiPackage /> {order?.status}
                  </div>
                  <div
                    className={`badge p-3 ${
                      order?.isPaid ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {order?.isPaid ? "Paid" : "Pending Payment"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="card bg-base-100 shadow-md print:shadow-none">
                <div className="card-body p-4 md:p-6">
                  <h2 className="card-title text-xl mb-4 flex items-center gap-2">
                    <span className="bg-primary text-primary-content rounded-full w-8 h-8 inline-flex items-center justify-center text-sm">
                      1
                    </span>
                    Order Items
                  </h2>

                  <div className="overflow-x-auto bg-base-200 p-2 rounded-2xl mx-4 md:mx-0">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th className="text-primary">Product</th>
                          <th className="hidden sm:table-cell text-primary">
                            Size
                          </th>
                          <th className="hidden sm:table-cell text-primary">
                            Price
                          </th>
                          <th className="hidden sm:table-cell text-primary">
                            Qty
                          </th>
                          <th className="text-primary">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order?.items?.map(
                          (item: OrderItemInterface, index: number) => (
                            <tr key={index} className="hover">
                              <td className="flex items-center gap-2">
                                {(item.product as ProductInterface)
                                  ?.images?.[0] && (
                                  <div className="w-12 h-12 sm:w-16 sm:h-16 relative rounded-md overflow-hidden border border-base-300 flex-shrink-0">
                                    <Image
                                      src={
                                        (item.product as ProductInterface)
                                          .images![0]
                                      }
                                      alt={
                                        (item.product as ProductInterface).name
                                      }
                                      fill
                                      sizes="(max-width: 640px) 48px, 64px"
                                      className="object-cover rounded-md"
                                      priority
                                    />
                                  </div>
                                )}
                                <div>
                                  <span className="font-semibold text-md line-clamp-2 ml-4">
                                    {(item.product as ProductInterface)?.name}
                                  </span>
                                  <div className="sm:hidden text-sm text-base-content/70 mt-1 ml-4">
                                    <div>
                                      Size:{" "}
                                      <span className="font-medium">
                                        {item.size}
                                      </span>
                                    </div>
                                    <div>
                                      Price:{" "}
                                      <span className="font-medium">
                                      ₹
                                        {(item.product as ProductInterface)
                                          ?.salePrice
                                          ? (
                                              item.product as ProductInterface
                                            )?.salePrice?.toFixed(2)
                                          : (
                                              item.product as ProductInterface
                                            )?.price.toFixed(2)}{" "}
                                        × {item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="hidden sm:table-cell">
                                {item.size}
                              </td>
                              <td className="hidden sm:table-cell">
                              ₹
                                {(item.product as ProductInterface)?.salePrice
                                  ? (
                                      item.product as ProductInterface
                                    )?.salePrice?.toFixed(2)
                                  : (
                                      item.product as ProductInterface
                                    )?.price.toFixed(2)}
                              </td>
                              <td className="hidden sm:table-cell text-center">
                                {item.quantity}
                              </td>
                              <td className="font-bold">
                              ₹{item.totalProductPrice?.toFixed(2)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="divider"></div>

                  <div className="w-full bg-base-300 p-4 rounded-2xl space-y-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Subtotal:</span>
                      <span className="text-primary text-lg font-semibold">
                      ₹
                        {(
                          order!.totalOrderPrice - order!.shippingPrice
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Shipping:</span>
                      <span className="text-primary text-lg font-semibold">
                      ₹{order!.shippingPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="divider"></div>
                    <div className="flex justify-between text-lg pt-2">
                      <span className="text-xl font-bold">Total:</span>
                      <span className="text-xl text-secondary font-bold">
                      ₹{order!.totalOrderPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card bg-base-100 shadow-md print:shadow-none">
                <div className="card-body p-4 md:p-6">
                  <h2 className="card-title text-xl flex items-center gap-2">
                    <span className="bg-primary text-primary-content rounded-full w-8 h-8 inline-flex items-center justify-center text-sm">
                      2
                    </span>
                    Customer Details
                  </h2>

                  <div className="divider mb-0"></div>

                  <div className="flex items-center mb-6">
                    <div className="avatar mr-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <Image
                          src={
                            (order?.customer as UserInterface).image
                              ? (order?.customer as UserInterface).image!
                              : "/AccountFallback.png"
                          }
                          alt={`${
                            (order?.customer as UserInterface).firstname
                          }'s profile`}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-lg">
                        {(order?.customer as UserInterface)?.firstname}{" "}
                        {(order?.customer as UserInterface)?.lastname}
                      </p>
                      <p className="text-sm text-base-content/70">
                        {(order?.customer as UserInterface)?.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 bg-base-200 p-4 rounded-2xl">
                    <div>
                      <h3 className="font-bold text-sm uppercase text-primary">
                        Shipping Address
                      </h3>
                      <p className="mt-1">{order?.shippingAddress}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm uppercase text-primary">
                        Contact Number
                      </h3>
                      <p className="mt-1">{order?.contactNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-300 rounded-2xl shadow-md print:shadow-none">
                <div className="card-body p-4 md:p-6">
                  <h2 className="card-title text-xl mb-4 flex items-center gap-2">
                    <span className="bg-primary text-primary-content rounded-full w-8 h-8 inline-flex items-center justify-center text-sm">
                      3
                    </span>
                    Payment
                  </h2>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-md">Method:</span>
                      <span className="font-bold text-primary">
                        {order?.paymentMethod}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-md">Status:</span>
                      <div
                        className={`badge ${
                          order?.isPaid ? "badge-success" : "badge-warning"
                        } p-2 md:p-3`}
                      >
                        {order?.isPaid ? "Paid" : "Pending Payment"}
                      </div>
                    </div>
                  </div>

                  {!order?.isPaid && order.paymentMethod !== "COD" && (
                    <RazorPayPaymentBtn
                      amount={Number(order.totalOrderPrice)}
                      orderIdDb={String(order._id)}
                    />
                  )}

                  {!order?.isPaid && order.paymentMethod === "COD" && (
                    <div className="w-full btn btn-secondary flex items-center">
                      <BsCash className="mr-2" />
                      <span>Cash on Delivery</span>
                    </div>
                  )}

                  {order?.isPaid && order.paymentResult && (
                    <div className="bg-base-200 border-2 border-primary p-4 rounded-lg text-sm space-y-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold">Transaction ID:</span>
                        <span className="text-right">
                          {order.paymentResult.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Date:</span>
                        <span className="text-right">
                          {new Date(
                            order.paymentResult.update_time || ""
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Email:</span>
                        <span className="text-right">
                          {order.paymentResult.email_address}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Amount:</span>
                        <span className="text-right">
                          {order.totalOrderPrice}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderSummary;
