import mongoose from "mongoose";

const evkTargetSchema = new mongoose.Schema(
  {

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // salesperson name
    revenueStream: { type: String, required: true },
    zohoSalespersonId: { type: String, required: true }, // Zoho reference ID

    date: { type: Date, required: true },
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

// -------------------- Auto-increment evkId --------------------
evkTargetSchema.pre("save", async function (next) {
  if (!this.isNew) return next(); // only for new documents

  if (!this.evkId) {
    const last = await mongoose.model("EvkTarget").findOne().sort({ evkId: -1 }).select("evkId");
    this.evkId = last ? last.evkId + 1 : 2000; // start from 2000 if empty
  }
  next();
});

export default mongoose.model("EvkTarget", evkTargetSchema);
