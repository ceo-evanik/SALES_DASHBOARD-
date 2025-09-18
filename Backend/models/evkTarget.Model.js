import mongoose from "mongoose";

const evkTargetSchema = new mongoose.Schema(
  {
    evkId: { type: Number, unique: true }, // ❌ removed required:true

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    revenueStream: { type: String, required: true },
    zohoSalespersonId: { type: String, required: true },

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
  if (!this.isNew) return next();

  if (!this.evkId) {
    const last = await mongoose.model("EvkTarget").findOne().sort({ evkId: -1 }).select("evkId");
    this.evkId = last ? last.evkId + 1 : 2000;
  }

  // normalize date to first of month
  if (this.date) {
    const d = new Date(this.date);
    this.date = new Date(d.getFullYear(), d.getMonth(), 1);
  }

  next();
});

// -------------------- Unique index (user+month+revenueStream) --------------------
evkTargetSchema.index(
  { userId: 1, revenueStream: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("EvkTarget", evkTargetSchema);
