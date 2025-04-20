"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllOrdersQuery } from "@/app/services/OrderData";
import QueryStateHandler from "@/components/QueryStateHandler";
import ThemeToggleFixed from "@/components/auth/ThemeToggleFixed";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { UserInterface } from "@/Interfaces";
import CancelOrder from "@/components/shop/orderComp/CancelOrder";
import MarkOrderDelivered from "@/components/admin/MarkOrderDelivered";

const ManageOrders = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showOnlyPaid, setShowOnlyPaid] = useState<boolean>(false);
  const [showOnlyDelivered, setShowOnlyDelivered] = useState<boolean>(false);

  const { data: orders, isLoading, isError, error } = useGetAllOrdersQuery();

  // Filter orders based on search and filters
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = searchQuery 
      ? String(order._id).includes(searchQuery) || 
        (order.customer && typeof order.customer !== 'string' && 
          (`${(order.customer as UserInterface).firstname} ${(order.customer as UserInterface).lastname}`).toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    const matchesPaidFilter = showOnlyPaid ? order.isPaid : true;
    const matchesDeliveredFilter = showOnlyDelivered ? order.isDelivered : true;
    
    return matchesSearch && matchesPaidFilter && matchesDeliveredFilter;
  });

  return (
    <>
      <QueryStateHandler isLoading={isLoading} isError={isError} error={error} LoadingFull={true} />
      
      <div className="min-h-screen bg-base-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => router.back()} className="btn btn-outline">
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <ThemeToggleFixed />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 underline decoration-3">
            Manage Orders
          </h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex-1 w-full">
              <SearchBar SearchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="form-control">
              <label className="cursor-pointer label gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={showOnlyPaid}
                  onChange={() => setShowOnlyPaid(prev => !prev)}
                />
                <span className="label-text">Only Paid Orders</span>
              </label>
            </div>
            <div className="form-control">
              <label className="cursor-pointer label gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={showOnlyDelivered}
                  onChange={() => setShowOnlyDelivered(prev => !prev)}
                />
                <span className="label-text">Only Delivered Orders</span>
              </label>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-300 text-base-content">
                <th className="text-center">Order ID</th>
                <th className="text-center">Customer</th>
                <th className="text-center">Date</th>
                <th className="text-center">Total</th>
                <th className="text-center">Status</th>
                <th className="text-center">Payment</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders && filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={String(order._id)}>
                    <td className="text-center">{String(order._id).slice(0, 8)}...</td>
                    <td className="text-center">
                      {typeof order.customer !== 'string' ? 
                        `${(order.customer as UserInterface).firstname} ${(order.customer as UserInterface).lastname}` : 
                        'Loading...'}
                    </td>
                    <td className="text-center">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-center font-semibold">
                    ₹{order.totalOrderPrice.toFixed(2)}
                    </td>
                    <td className="text-center">
                      <div className={`badge ${
                        order.status.toLowerCase() === 'delivered' ? 'badge-success' : 
                        'badge-warning'
                      } p-2 font-bold`}>
                        {order.status}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className={`badge ${order.isPaid ? 'badge-success' : 'badge-error'} p-2 font-bold`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/orders/${order._id}`} className="btn btn-sm btn-secondary">
                          View
                        </Link>
                        
                        {!order.isDelivered && order.isPaid && (
                          <MarkOrderDelivered orderId={String(order._id)} />
                        )}
                        
                        {!order.isDelivered && (
                          <CancelOrder orderId={String(order._id)} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageOrders;