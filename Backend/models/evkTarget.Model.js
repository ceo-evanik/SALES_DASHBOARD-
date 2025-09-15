import mongoose from "mongoose";

const evkTargetSchema = new mongoose.Schema(
  {
    evkId: { type: Number, required: true, unique: true }, // matches XML
    salesperson: { type: mongoose.Schema.Types.ObjectId, ref: "Salesperson" }, // optional, can match Zoho ID later
    month: { type: String }, // e.g., "2025-09"
    name: { type: String },
    revenueStream: { type: String },
    zohoSalespersonId: { type: String },
    date: { type: Date },
    totalAch: { type: Number },
    totalTarget: { type: Number },
    imageUrl: { type: String },
    importMeta: {
      source: String,
      importedAt: Date,
      importedBy: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("EvkTarget", evkTargetSchema);
