import EvkTarget from "../models/evkTarget.Model.js";
import { logger } from "../config/logger.js";
import { validationResult } from "express-validator";

// -------------------- Create target (Admin only) --------------------
export const createTarget = async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ success: false, errors: errs.array() });
    }

    const existing = await EvkTarget.findOne({ evkId: req.body.evkId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Target with this evkId already exists",
      });
    }

    const target = new EvkTarget({
      ...req.body,
      importMeta: {
        source: "manual-create",
        importedAt: new Date(),
        importedBy: req.user?.username || "system",
      },
    });

    await target.save();
    logger.info(`Target created | evkId=${target.evkId} by ${req.user?.username}`);
    res.status(201).json({ success: true, data: target });
  } catch (err) {
    next(err);
  }
};

// -------------------- Update target (Admin only) --------------------
export const updateTarget = async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ success: false, errors: errs.array() });
    }

    if (req.user.userType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update target values",
      });
    }

    // Add audit fields
    const updateData = {
      ...req.body,
      "importMeta.importedAt": new Date(),
      "importMeta.importedBy": req.user?.username || "system",
    };

    const target = await EvkTarget.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!target) {
      return res.status(404).json({ success: false, message: "Target not found" });
    }

    logger.info(`Target updated | id=${req.params.id} by ${req.user?.username}`);
    res.json({ success: true, data: target });
  } catch (err) {
    next(err);
  }
};


// -------------------- Get all targets --------------------
export const getTargets = async (req, res, next) => {
  try {
    const targets = await EvkTarget.find().populate(
      "userId",
      "name email userType supervisorId supervisorName department contactNo"
    );
    res.json({ success: true, data: targets });
  } catch (err) {
    next(err);
  }
};

// -------------------- Get single target --------------------
export const getTarget = async (req, res, next) => {
  try {
    const target = await EvkTarget.findById(req.params.id).populate(
      "userId",
      "name email userType"
    );
    if (!target) {
      return res.status(404).json({ success: false, message: "Target not found" });
    }
    res.json({ success: true, data: target });
  } catch (err) {
    next(err);
  }
};

// -------------------- Delete target (Admin only) --------------------
export const deleteTarget = async (req, res, next) => {
  try {
    const target = await EvkTarget.findByIdAndDelete(req.params.id);
    if (!target) {
      return res.status(404).json({ success: false, message: "Target not found" });
    }
    logger.info(`Target deleted | id=${req.params.id} by ${req.user?.username}`);
    res.json({ success: true, message: "Target deleted" });
  } catch (err) {
    next(err);
  }
};

// -------------------- Update achieved (Sales/Admin) --------------------
export const updateAchieved = async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ success: false, errors: errs.array() });
    }

    const { month, achieved } = req.body;
    const target = await EvkTarget.findById(req.params.id);

    if (!target) {
      return res.status(404).json({ success: false, message: "Target not found" });
    }

    // Authorization: sales can only update their own target
    if (req.user.userType !== "admin") {
      if (!target.userId || target.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Not authorized to update this target" });
      }
    }

    // Ensure months array exists
    if (!Array.isArray(target.months)) {
      target.months = [];
    }

    // Update monthly entry
    const monthEntry = target.months.find((m) => m.month === month);
    if (monthEntry) {
      monthEntry.achieved = achieved;
    } else {
      target.months.push({ month, achieved, target: 0 });
    }

    // Recalculate total achieved
    target.totalAch = target.months.reduce((sum, m) => sum + (m.achieved || 0), 0);

    target.importMeta.importedAt = new Date();
    target.importMeta.importedBy = req.user?.username || "system";

    await target.save();

    logger.info(
      `Target achieved updated | id=${req.params.id} month=${month} by ${req.user?.username}`
    );

    // ✅ Send clean response (same as createTarget format)
    res.json({ success: true, data: target });
  } catch (err) {
    next(err);
  }
};


// -------------------- Get targets summary --------------------
export const getTargetsSummary = async (req, res, next) => {
  try {
    const agg = await EvkTarget.aggregate([
      {
        $group: {
          _id: "$revenueStream",
          target: { $sum: "$totalTarget" },
          achieved: { $sum: "$totalAch" },
        },
      },
    ]);

    const summary = {
      Renewal: { target: 0, achieved: 0, percent: 0 },
      Acquisition: { target: 0, achieved: 0, percent: 0 },
      Total: { target: 0, achieved: 0, percent: 0 },
    };

    for (const row of agg) {
      const stream = row._id?.toLowerCase();
      if (stream === "renewal") {
        summary.Renewal.target = row.target;
        summary.Renewal.achieved = row.achieved;
        summary.Renewal.percent = row.target ? (row.achieved / row.target) * 100 : 0;
      } else {
        summary.Acquisition.target += row.target;
        summary.Acquisition.achieved += row.achieved;
        summary.Acquisition.percent = summary.Acquisition.target
          ? (summary.Acquisition.achieved / summary.Acquisition.target) * 100
          : 0;
      }
    }

    // Totals
    summary.Total.target = summary.Renewal.target + summary.Acquisition.target;
    summary.Total.achieved = summary.Renewal.achieved + summary.Acquisition.achieved;
    summary.Total.percent = summary.Total.target
      ? (summary.Total.achieved / summary.Total.target) * 100
      : 0;

    // Extra fields (3-month logic)
    const balance = summary.Total.target - summary.Total.achieved;
    const currentAvg = summary.Total.achieved / 3;
    const requiredRate = balance / 3;

    res.json({
      success: true,
      data: {
        Renewal: summary.Renewal,
        Acquisition: summary.Acquisition,
        Total: summary.Total,
        Balance: balance,
        CurrentAvg: currentAvg,
        RequiredRate: requiredRate,
      },
    });
  } catch (err) {
    next(err);
  }
};
