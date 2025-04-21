"use client";

import ToastStyles from "@/styles/ToastStyles";
import Script from "next/script";
import { useState } from "react";
import { SiRazorpay } from "react-icons/si";
import { toast } from "react-toastify";

const RazorPayPaymentBtn = ({amount, orderIdDb}: {amount: number, orderIdDb: string}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createOrder = async () => {
    setIsLoading(true);
    try {
      const amountToPay = (amount * 100).toFixed(0);
      const res = await fetch("/api/createRazorpayOrder", {
        method: "POST",
        body: JSON.stringify({ amount: Number(amountToPay) }),
      });
      const data = await res.json();

      const paymentData = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: data.id,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          // verify payment
          const res = await fetch("/api/verifyRazorPayOrder", {
            method: "POST",
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderIdDb,
            }),
          });
          const data = await res.json();
          toast.success("Payment successful", ToastStyles);
          setTimeout(() => {
            if (data.success) {
              console.log("reached here")
              window.location.reload();
            } else {
              toast.error("Payment Failed", ToastStyles);
            }
          }, 2000);
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payment = new (window as any).Razorpay(paymentData);
      payment.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      toast.error("Payment Failed", ToastStyles);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <button
        className="w-full btn btn-primary flex items-center gap-x-2"
        onClick={createOrder}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Processing
          </>
        ) : (
          <>
            <SiRazorpay />
            Pay Now
          </>
        )}
      </button>
    </>
  );
}

export default RazorPayPaymentBtn;
