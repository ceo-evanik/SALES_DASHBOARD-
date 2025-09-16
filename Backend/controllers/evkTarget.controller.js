import EvkTarget from "../models/evkTarget.Model.js";

/**
 * Create a new EVK Target
 * - Admin only (RBAC)
 * - Can attach salesperson reference and Zoho ID
 */
export const createTarget = async (req, res, next) => {
  try {
    const { evkId, salesperson, month, name, revenueStream, zohoSalespersonId, date, totalAch, totalTarget, imageUrl } = req.body;

    // Ensure evkId is unique
    const exists = await EvkTarget.findOne({ evkId });
    if (exists) {
      return res.status(400).json({ success: false, message: "EVK target with this evkId already exists" });
    }

    const target = await EvkTarget.create({
      evkId,
      salesperson,
      month,
      name,
      revenueStream,
      zohoSalespersonId,
      date,
      totalAch,
      totalTarget,
      imageUrl,
      importMeta: {
        source: "manual-create",
        importedAt: new Date(),
        importedBy: req.user?.username || "system",
      },
    });

    res.status(201).json({ success: true, data: target });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all EVK Targets
 * - Supports query filters (e.g., ?month=2025-09)
 */
export const getTargets = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.month) query.month = req.query.month;
    if (req.query.salespersonId) query.salesperson = req.query.salespersonId;

    const targets = await EvkTarget.find(query).populate("salesperson");
    res.json({ success: true, count: targets.length, data: targets });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single EVK Target by Mongo ID
 */
export const getTargetById = async (req, res, next) => {
  try {
    const target = await EvkTarget.findById(req.params.id).populate("salesperson");
    if (!target) return res.status(404).json({ success: false, message: "Target not found" });
    res.json({ success: true, data: target });
  } catch (error) {
    next(error);
  }
};

/**
 * Update EVK Target
 */
export const updateTarget = async (req, res, next) => {
  try {
    const body = {
      ...req.body,
      "importMeta.importedAt": new Date(),
      "importMeta.importedBy": req.user?.username || "system",
    };

    const target = await EvkTarget.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!target) return res.status(404).json({ success: false, message: "Target not found" });
    res.json({ success: true, data: target });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete EVK Target
 */
export const deleteTarget = async (req, res, next) => {
  try {
    const target = await EvkTarget.findByIdAndDelete(req.params.id);
    if (!target) return res.status(404).json({ success: false, message: "Target not found" });
    res.json({ success: true, message: "Target deleted" });
  } catch (error) {
    next(error);
  }
};
