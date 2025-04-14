import mongoose from "mongoose";
import { CategoryInterface } from "@/Interfaces";

const CategorySchema = new mongoose.Schema<CategoryInterface>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    isfeatured: {type: Boolean, default: false},
    image: { type: String },
    description: { type: String },
    metatitle: { type: String },
    metadesc: { type: String },
    metakeywords: [{ type: String }],
  },
  { timestamps: true }
);
 
CategorySchema.index({ isfeatured: 1 }); 
CategorySchema.index({ createdAt: -1 }); 

const Category = mongoose.models?.Category || mongoose.model<CategoryInterface>('Category',CategorySchema);
export default Category;