import express from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "../controllers/lead.controller.js";
import { protect, authorize } from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.post("/", protect, authorize("support", "sales"), createLead);
router.get("/", protect, authorize("admin", "sales", "support"), getLeads);
router.get("/:id", protect, authorize("admin", "sales", "support"), getLeadById);
router.put("/:id", protect, authorize("sales"), updateLead);
router.delete("/:id", protect, authorize("admin"), deleteLead);

export default router;
