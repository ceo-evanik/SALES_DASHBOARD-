import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    salesperson: { type: mongoose.Schema.Types.ObjectId, ref: "Salesperson", required: true },
    amount: { type: Number, required: true },
    customer: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
