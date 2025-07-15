import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    pname: { type: String },
    price: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);