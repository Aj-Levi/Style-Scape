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
    totalOrderPrice: { type: Number, required: true, default: 0.0 },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    paymentMethod: {type: String, required: true},

    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },

    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

OrderSchema.index({customer: 1});
OrderSchema.index({status: 1});

const Order = mongoose.models?.Order || mongoose.model<OrderInterface>("Order", OrderSchema);
export default Order;
