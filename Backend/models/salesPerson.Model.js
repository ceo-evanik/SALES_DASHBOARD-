import mongoose from "mongoose";

const salespersonSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    region: { type: String, required: true },
    target: { type: Number, default: 0 },
    achieved: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Salesperson", salespersonSchema);
