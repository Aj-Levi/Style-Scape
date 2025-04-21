"use client";

import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useGetCartItemsQuery } from "@/app/services/UserData";
import ProceedToCheckout from "./ProceedToCheckout";
import AddressInput from "@/components/profile/AddressInput";
import PhoneInput from "@/components/profile/PhoneInput";
import QueryStateHandler from "@/components/QueryStateHandler";
import { useAddOrderMutation } from "@/app/services/OrderData";
import { toast } from "react-toastify";
import ToastStyles from "@/styles/ToastStyles";
import MutationStateHandler from "@/components/MutationStateHandler";
import { useRouter } from "next/navigation";
import { SiRazorpay } from "react-icons/si";
import { BsCash } from "react-icons/bs";

const ExpandedCheckout = ({ subtotal }: { subtotal: number }) => {
  const [Phone, setPhone] = useState<string | undefined>("");
  const [PhoneError, setPhoneError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isPlacing, setIsPlacing] = useState<boolean>(false);

  const router = useRouter();

  const { data: user, isLoading, isError, error } = useGetCartItemsQuery();
  const [
    addOrder,
    {
      isLoading: isLoadingAdd,
      isError: isErrorAdd,
      error: errorAdd,
      isSuccess: isSuccessAdd,
    },
  ] = useAddOrderMutation();

  const handlePlaceOrder = async (formdata: FormData) => {
    setIsPlacing(true);

    const phone = formdata.get("phone") as string;
    const address = formdata.get("address") as string;

    if (!phone || phone.length === 0 || !address || address.length === 0) {
      toast.warn("Shipping and contact details are required", ToastStyles);
      return;
    }

    const orderDetails = {
      contactNumber: phone,
      shippingAddress: address,
      paymentMethod,
    };

    try {
      const {order_ID} = await addOrder(orderDetails).unwrap();
      setTimeout(() => {
        router.push(`/orders/${order_ID}`);
      }, 1500);
    } catch (error) {
      console.error("Could not place the order", error);
      toast.error("Could not place the order", ToastStyles);
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <QueryStateHandler
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      <MutationStateHandler
        isError={isErrorAdd}
        isSuccess={isSuccessAdd}
        error={errorAdd}
        SuccessMessage="Order Registered, Waiting for Payment"
      />

      <div className="card bg-base-100 shadow-sm p-6">
        <h3 className="text-xl font-bold text-primary underline decoration-2 underline-offset-4 mb-4">
          Order Summary
        </h3>
        <ProceedToCheckout SubTotal={subtotal} />
      </div>

      <form
        action={handlePlaceOrder}
        className="card bg-base-100 shadow-sm p-6"
      >
        <h2 className="text-xl font-bold text-primary underline decoration-2 underline-offset-4">
          Customer Details
        </h2>
        <div className="mb-6">
          <AddressInput address={user?.address} />
        </div>

        <div className="mb-6">
          <PhoneInput
            phone={user?.phone}
            Phone={Phone}
            setPhone={setPhone}
            PhoneError={PhoneError}
            setPhoneError={setPhoneError}
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Payment Method</h3>
          <div className="flex flex-col gap-3">
            <label className="flex items-center p-3 border rounded-md cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === "razorpay"}
                onChange={() => setPaymentMethod("razorpay")}
                className="radio radio-primary mr-3"
              />
              <SiRazorpay className="mr-2" />
              <span>RazorPay</span>
            </label>
            <label className="flex items-center p-3 border rounded-md cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="radio radio-primary mr-3"
              />
              <BsCash className="mr-2" />
              <span>Cash on Delivery</span>
            </label>
          </div>
        </div>

        <button
        type="submit"
          disabled={isLoading || isPlacing || isLoadingAdd}
          className="w-full btn btn-primary btn-md"
        >
          {(isLoading || isPlacing || isLoadingAdd) ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Please Wait
            </>
          ) : (
            <>
              Proceed to Checkout <FaArrowRight className="ml-2" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ExpandedCheckout;
