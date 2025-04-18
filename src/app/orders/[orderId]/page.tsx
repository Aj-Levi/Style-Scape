"use client";

import { useGetOrderByIdQuery } from "@/app/services/OrderData";
import React from "react";
import { Image } from "@imagekit/next";
import { useRouter } from "next/navigation";
import { FaPaypal, FaArrowLeft, FaPrint } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";
import { OrderItemInterface, ProductInterface } from "@/Interfaces";

const OrderSummary = ({ params }: { params: Promise<{ orderId: string }> }) => {
  const unwrappedParams = React.use(params);
  const { orderId } = unwrappedParams;
  const router = useRouter();

  const { data: order, isLoading, isError } = useGetOrderByIdQuery(String(orderId));

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-base-content/80 animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-3xl mx-auto my-10 px-4">
        <button 
          onClick={() => router.back()} 
          className="btn btn-sm btn-ghost mb-4 print:hidden"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Unable to load order details. Please try again or contact support.</span>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentResult?.status === "succeeded";
  const customer = order.customer as any;
  const orderDate = new Date(order._id.toString().substring(0, 8)).toLocaleDateString();
  
  // Define status classes
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-success';
      case 'shipped': return 'bg-info';
      case 'processing': return 'bg-warning';
      default: return 'bg-neutral';
    }
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-6xl">
      {/* Header with Back Button and Actions */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3 print:hidden">
        <button 
          onClick={() => router.back()} 
          className="btn btn-sm btn-ghost"
        >
          <FaArrowLeft className="mr-2" /> Back to Orders
        </button>
        
        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn btn-sm btn-outline">
            <FaPrint className="mr-1" /> Print Receipt
          </button>
        </div>
      </div>

      {/* Order Summary Card - For Quick Overview */}
      <div className="card bg-base-100 shadow-md mb-6 print:shadow-none">
        <div className="card-body p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Order #{orderId.slice(0, 8)}</h1>
              <p className="text-sm text-base-content/70">Placed on {orderDate}</p>
            </div>
            
            <div className="flex flex-col items-start sm:items-end">
              <div className="badge badge-lg mb-2 p-3 gap-2 font-medium capitalize" 
                style={{backgroundColor: getStatusClass(order.status)}}>
                <BiPackage /> {order.status}
              </div>
              <div className={`badge p-3 ${isPaid ? 'badge-success' : 'badge-warning'}`}>
                {isPaid ? 'Paid' : 'Pending Payment'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Progress Timeline */}
      <div className="mb-6 print:hidden">
        <ul className="steps steps-horizontal w-full overflow-x-auto pb-2">
          <li className="step step-primary">Order Placed</li>
          <li className={`step ${order.status !== 'pending' ? 'step-primary' : ''}`}>Processing</li>
          <li className={`step ${order.status === 'shipped' || order.status === 'delivered' ? 'step-primary' : ''}`}>Shipped</li>
          <li className={`step ${order.status === 'delivered' ? 'step-primary' : ''}`}>Delivered</li>
        </ul>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Product Details */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-md print:shadow-none">
            <div className="card-body p-4 md:p-6">
              <h2 className="card-title text-xl mb-4 flex items-center gap-2">
                <span className="bg-primary text-primary-content rounded-full w-8 h-8 inline-flex items-center justify-center text-sm">1</span>
                Order Items
              </h2>
              
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="hidden sm:table-cell">Size</th>
                      <th className="hidden sm:table-cell">Price</th>
                      <th className="hidden sm:table-cell">Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items!.map((item: OrderItemInterface, index: number) => (
                      <tr key={index} className="hover">
                        <td className="flex items-center gap-2">
                          {(item.product as ProductInterface)?.images?.[0] && (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 relative rounded-md overflow-hidden border border-base-300 flex-shrink-0">
                              <Image 
                                src={(item.product as ProductInterface).images![0]} 
                                alt={(item.product as ProductInterface).name} 
                                fill
                                sizes="(max-width: 640px) 48px, 64px"
                                className="object-cover rounded-md"
                                priority
                              />
                            </div>
                          )}
                          <div>
                            <span className="font-medium line-clamp-2">{(item.product as ProductInterface)?.name}</span>
                            <div className="sm:hidden text-sm text-base-content/70 mt-1">
                              <div>Size: <span className="font-medium">{item.size}</span></div>
                              <div>Price: <span className="font-medium">${(item.product as ProductInterface)?.price?.toFixed(2)} × {item.quantity}</span></div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell">{item.size}</td>
                        <td className="hidden sm:table-cell">${(item.product as ProductInterface)?.price?.toFixed(2)}</td>
                        <td className="hidden sm:table-cell text-center">{item.quantity}</td>
                        <td className="font-bold">${item.totalProductPrice?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="divider"></div>
              
              <div className="ml-auto w-full sm:max-w-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Subtotal:</span>
                  <span className="font-medium">${(order.totalOrderPrice - order.shippingPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Shipping:</span>
                  <span className="font-medium">${order.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">${order.totalOrderPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Customer Details & Payment */}
        <div className="space-y-6">
          {/* Customer Details */}
          <div className="card bg-base-100 shadow-md print:shadow-none">
            <div className="card-body p-4 md:p-6">
              <h2 className="card-title text-xl mb-4 flex items-center gap-2">
                <span className="bg-primary text-primary-content rounded-full w-8 h-8 inline-flex items-center justify-center text-sm">2</span>
                Customer Details
              </h2>
              
              <div className="flex items-center mb-6">
                {customer?.image && (
                  <div className="avatar mr-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <Image 
                        src={customer.image} 
                        alt={`${customer.firstname}'s profile`}
                        width={64} 
                        height={64}
                        className="object-cover" 
                      />
                    </div>
                  </div>
                )}
                <div>
                  <p className="font-bold text-lg">{customer?.firstname} {customer?.lastname}</p>
                  <p className="text-sm text-base-content/70">{customer?.email}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-sm uppercase text-base-content/70">Shipping Address</h3>
                  <p className="mt-1">{order.shippingAddress}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-sm uppercase text-base-content/70">Contact Number</h3>
                  <p className="mt-1">{order.contactNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="card bg-base-100 shadow-md print:shadow-none">
            <div className="card-body p-4 md:p-6">
              <h2 className="card-title text-xl mb-4 flex items-center gap-2">
                <span className="bg-primary text-primary-content rounded-full w-8 h-8 inline-flex items-center justify-center text-sm">3</span>
                Payment
              </h2>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">Method:</span>
                  <span>{order.paymentMethod}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-bold">Status:</span>
                  <div className={`badge ${isPaid ? 'badge-success' : 'badge-warning'} p-2 md:p-3`}>
                    {isPaid ? 'Paid' : 'Pending Payment'}
                  </div>
                </div>
              </div>
              
              {!isPaid && (
                <div className="mt-6 print:hidden">
                  <button className="btn btn-primary w-full flex items-center justify-center gap-2 btn-md">
                    <FaPaypal size={18} />
                    Pay Now
                  </button>
                  <p className="text-xs text-center mt-2 text-base-content/70">
                    Secure payment via PayPal
                  </p>
                </div>
              )}

              {isPaid && order.paymentResult && (
                <div className="bg-base-200 p-4 rounded-lg text-sm space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold">Transaction ID:</span>
                    <span className="text-right">{order.paymentResult.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Date:</span>
                    <span className="text-right">{new Date(order.paymentResult.update_time || '').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Email:</span>
                    <span className="text-right">{order.paymentResult.email_address}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Help Box */}
          <div className="card bg-base-200 print:hidden">
            <div className="card-body p-4">
              <h3 className="font-bold">Need Help?</h3>
              <p className="text-sm">If you have questions about your order, please contact our customer support.</p>
              <button className="btn btn-sm btn-outline btn-block mt-2">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;