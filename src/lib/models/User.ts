import mongoose from "mongoose";
import { UserInterface } from "@/Interfaces";

const UserSchema = new mongoose.Schema<UserInterface>(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: false, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    role: { type: String, default: "user" },
    image: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    cartitems: [
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
    orders: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Order" },
    ],
    authProviderId: { type: String },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });
UserSchema.index({ authProviderId: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ firstname: 1, lastname: 1 });

const User =
  mongoose.models?.User || mongoose.model<UserInterface>("User", UserSchema);
export default User;
