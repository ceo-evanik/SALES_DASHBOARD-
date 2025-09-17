import express from "express";
import { protect, authorize } from "../middlewares/auth.Middleware.js";
import { syncInvoicesFromZoho } from "../controllers/invoice.controller.js";
import {
  fetchInvoices,
  fetchUnpaidInvoices,
  fetchUnpaidTotals,
  fetchEstimates,
  fetchMonthlySummary,
  fetchOverallUnpaid,
  fetchInvoicePdfUrl,
} from "../controllers/zoho.controller.js";

const router = express.Router();

// 🔄 Sync invoices to Mongo (admin/manager only)
router.post("/invoices/sync", protect, authorize("admin", "manager"), syncInvoicesFromZoho);

// 📊 Read-only API
router.get("/invoices", fetchInvoices);
router.get("/invoices/unpaid", fetchUnpaidInvoices);
router.get("/invoices/unpaid-totals", fetchUnpaidTotals);
router.get("/estimates", fetchEstimates);
router.get("/summary/month", fetchMonthlySummary);
router.get("/unpaid/overall", fetchOverallUnpaid);

// 🔒 PDF portal URL instead of direct PDF
router.get("/invoice/:id/pdf", fetchInvoicePdfUrl);

export default router;
