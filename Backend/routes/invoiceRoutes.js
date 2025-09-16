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

router.post("/", protect, authorize("admin", "sales"), createInvoice);
router.get("/", protect, getInvoices);
router.get("/:id", protect, getInvoiceById);
router.put("/:id", protect, authorize("admin", "sales"), updateInvoice);
router.delete("/:id", protect, authorize("admin"), deleteInvoice);

export default router;
