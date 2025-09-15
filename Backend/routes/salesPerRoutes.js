import express from "express";
import {
  createSalesperson,
  getSalespersons,
  getSalespersonById,
  updateSalesperson,
  deleteSalesperson,
} from "../controllers/salesPerson.controller.js";
import { protect, authorize } from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createSalesperson);
router.get("/", protect, authorize("admin", "support"), getSalespersons);
router.get("/:id", protect, authorize("admin", "support"), getSalespersonById);
router.put("/:id", protect, authorize("admin"), updateSalesperson);
router.delete("/:id", protect, authorize("admin"), deleteSalesperson);

export default router;
