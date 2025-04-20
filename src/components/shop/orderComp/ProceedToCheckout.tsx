import React from "react";

const ProceedToCheckout = ({ SubTotal }: { SubTotal: number }) => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex flex-col gap-y-2 mt-4">
        <div className="flex justify-between">
          <span className="text-lg font-semibold">Subtotal:</span>
          <span className="text-md text-primary font-semibold">${SubTotal}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-lg font-semibold">Shipping:</span>
          <span className="text-md text-primary font-semibold">{SubTotal > 300 ? "Free" : 150}</span>
        </div>

        <div className="divider my-2"></div>
      </div>

      <div className="flex justify-between text-lg">
        <span className="font-bold">Total:</span>
        <span className="font-bold">
          ${SubTotal + (SubTotal > 300 ? 0 : 150)}
        </span>
      </div>
    </div>
  );
};

export default ProceedToCheckout;
