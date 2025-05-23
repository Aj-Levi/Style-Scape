import mongoose from "mongoose";
import { ProductInterface } from "@/Interfaces";

const ProductSchema = new mongoose.Schema<ProductInterface>(
  {
    name: { type: String, required: true, unique:true, trim: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    salePrice: { type: Number, required: false },
    category: { type: String, required: false },
    categoryId: { type: String, required: true },
    reviews: [{type: mongoose.Schema.Types.ObjectId, required: true, ref: "Review"}],
    rating: {type: Number, required: true, default: 1},
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String, required: false }],
    isFeatured: { type: Boolean, required:true, default: false },
    isOnSale: { type: Boolean, required:true, default: false },
    sizes: [{ type: String, required: false }],
    metatitle: { type: String },
    metadesc: { type: String },
    metakeywords: [{ type: String }],
  },
  { timestamps: true }
);

ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isOnSale: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

const Product =
  mongoose.models?.Product ||
  mongoose.model<ProductInterface>("Product", ProductSchema);
export default Product;
