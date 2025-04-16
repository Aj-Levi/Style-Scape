import { OrderInterface } from "@/Interfaces";
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema<OrderInterface>(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        size: {type: String, required: true},
        quantity: { type: Number, required: true, default: 1 },
        totalProductPrice: { type: Number },
      },
    ],
    status: { type: String, required: true, default: "pending" },
    shippingAddress: { type: String, required: true },
    contactNumber: { type: String, required: true },
    totalOrderPrice: { type: Number },
  },
  { timestamps: true }
);

OrderSchema.index({customer: 1});
OrderSchema.index({status: 1});

const Order = mongoose.models?.Order || mongoose.model<OrderInterface>("Order", OrderSchema);
export default Order;
