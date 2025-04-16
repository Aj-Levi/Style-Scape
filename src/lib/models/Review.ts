import { ReviewInterface } from "@/Interfaces";
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema<ReviewInterface>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    rating: { type: Number, required: true, min: 1, max: 5, default: 1 },
    comment: { type: String },
  },
  { timestamps: true }
);

ReviewSchema.index({user: 1});

const Review =
  mongoose.models?.Review || mongoose.model<ReviewInterface>("Review", ReviewSchema);
export default Review;
