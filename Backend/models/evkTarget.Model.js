import mongoose from "mongoose";

const monthSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in format YYYY-MM"], // YYYY-MM
    },
    target: { type: Number, required: true, min: 0 },
    achieved: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const evkTargetSchema = new mongoose.Schema(
  {
    evkId: { type: Number, required: true, unique: true },

    // 👇 Reference to User model (salesperson or support)
    salesperson: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    name: { type: String }, // Friendly name (redundant but useful for reports)
    revenueStream: { type: String },
    zohoSalespersonId: { type: String },
    imageUrl: { type: String, default: null },

    // 👇 If you want to store overall totals from import
    totalTarget: { type: Number, default: 0 },
    totalAch: { type: Number, default: 0 },

    // 👇 For imported record date
    date: { type: Date },

    months: {
      type: [monthSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one month record is required",
      },
    },

    importMeta: {
      source: { type: String, default: "manual" },
      importedAt: { type: Date, default: Date.now },
      importedBy: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("EvkTarget", evkTargetSchema);
