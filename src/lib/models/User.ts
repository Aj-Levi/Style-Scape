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
    phone: {type: String, required: false},
    address: {type: String, required: false},
    authProviderId: {type: String}
  },
  { timestamps: true }
);

const User = mongoose.models?.User || mongoose.model<UserInterface>('User',UserSchema);
export default User;