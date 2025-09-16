import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    // Unique Zoho invoice identifier
    zohoInvoiceId: { type: String, required: true, unique: true, index: true },

    // Salesperson linkage
    salespersonZohoId: { type: String }, // from Zoho
    salespersonName: { type: String },
    salesperson: { type: mongoose.Schema.Types.ObjectId, ref: "Salesperson" }, // local DB ref (optional)

    // Invoice metadata
    invoiceNumber: { type: String, required: true },
    status: { type: String }, // e.g., "paid", "unpaid"
    date: { type: Date }, // invoice issue date
    dueDate: { type: Date },

    // Customer details
    customerName: { type: String },
    customerGstin: { type: String },

    // Financials
    total: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },

    // Raw Zoho JSON (for audit / debugging)
    raw: { type: Object },

    // Sync info
    syncedAt: { type: Date, default: Date.now },
    importMeta: {
      source: { type: String, default: "zoho" }, // zoho/manual/etc
      importedBy: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
