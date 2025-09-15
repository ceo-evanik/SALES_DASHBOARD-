import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoice.controller.js";
import { protect, authorize } from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.post("/", protect, authorize("sales"), createInvoice);
router.get("/", protect, authorize("admin", "sales", "support"), getInvoices);
router.get("/:id", protect, authorize("admin", "sales", "support"), getInvoiceById);
router.put("/:id", protect, authorize("sales"), updateInvoice);
router.delete("/:id", protect, authorize("admin"), deleteInvoice);

export default router;
