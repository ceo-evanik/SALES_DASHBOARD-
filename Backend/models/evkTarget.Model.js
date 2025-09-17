import mongoose from "mongoose";

const evkTargetSchema = new mongoose.Schema(
  {
    evkId: { type: Number, required: true, unique: true },

    // Reference to sales/support user
    salesperson: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    name: { type: String, required: true }, // salesperson name
    revenueStream: { type: String, required: true },
    zohoSalespersonId: { type: String, required: true },

    // Month-specific data
    date: { type: Date, required: true }, // represents the month (e.g., 2025-07-01)
    totalTarget: { type: Number, required: true, min: 0 },
    totalAch: { type: Number, default: 0, min: 0 },

    imageUrl: { type: String, default: null },

    importMeta: {
      source: { type: String, default: "manual" },
      importedAt: { type: Date, default: Date.now },
      importedBy: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("EvkTarget", evkTargetSchema);
