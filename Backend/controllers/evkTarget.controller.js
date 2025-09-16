import EvkTarget from "../models/evkTarget.Model.js";
import { validationResult } from "express-validator";
import { logger } from "../config/logger.js";
import dayjs from "dayjs";
import User from "../models/User.js";

// Admin: create target
export const createTarget = async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty())
      return res.status(400).json({ success: false, errors: errs.array() });

    const {
      evkId,
      salesperson, // ObjectId of User
      name,
      revenueStream,
      zohoSalespersonId,
      imageUrl,
      months,
      totalTarget,
      totalAch,
      date,
    } = req.body;

    const exists = await EvkTarget.findOne({ evkId }).lean();
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Target with this evkId already exists" });

    const target = await EvkTarget.create({
      evkId,
      salesperson,
      name,
      revenueStream,
      zohoSalespersonId,
      imageUrl,
      months,
      totalTarget,
      totalAch,
      date,
      importMeta: {
        source: "manual-create",
        importedAt: new Date(),
        importedBy: req.user?.username || "system",
      },
    });

    logger.info(`Target created | evkId=${evkId} by ${req.user?.username}`);
    res.status(201).json({ success: true, data: target });
  } catch (err) {
    next(err);
  }
};

// Get targets (admin sees all, sales/support sees only theirs)
export const getTargets = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.month) query["months.month"] = req.query.month;
    if (req.query.salespersonId) query.salesperson = req.query.salespersonId;

    if (req.user.userType === "sales" || req.user.userType === "support") {
      query.salesperson = req.user.id;
    }

    const targets = await EvkTarget.find(query)
      .populate("salesperson", "name email userType department supervisorId supervisorName")
      .lean();

    res.json({ success: true, count: targets.length, data: targets });
  } catch (err) {
    next(err);
  }
};

// Update target (admin)
export const updateTarget = async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty())
      return res.status(400).json({ success: false, errors: errs.array() });

    const body = {
      ...req.body,
      "importMeta.importedAt": new Date(),
      "importMeta.importedBy": req.user?.username || "system",
    };

    const target = await EvkTarget.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!target)
      return res.status(404).json({ success: false, message: "Target not found" });

    logger.info(`Target updated | id=${req.params.id} by ${req.user?.username}`);
    res.json({ success: true, data: target });
  } catch (err) {
    next(err);
  }
};

// Delete target (admin)
export const deleteTarget = async (req, res, next) => {
  try {
    const target = await EvkTarget.findByIdAndDelete(req.params.id);
    if (!target)
      return res.status(404).json({ success: false, message: "Target not found" });

    logger.warn(`Target deleted | id=${req.params.id} by ${req.user?.username}`);
    res.json({ success: true, message: "Target deleted" });
  } catch (err) {
    next(err);
  }
};

// Sales/Support (or admin) updates achieved for a month
export const updateAchieved = async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty())
      return res.status(400).json({ success: false, errors: errs.array() });

    const { month, achieved } = req.body;
    const target = await EvkTarget.findById(req.params.id);
    if (!target)
      return res.status(404).json({ success: false, message: "Target not found" });

    // Only admin or owner can update achieved
    if (req.user.userType !== "admin") {
      if (!target.salesperson || target.salesperson.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ success: false, message: "Not authorized to update this target" });
      }
    }

    const monthRecord = target.months.find((m) => m.month === month);
    if (!monthRecord) {
      return res
        .status(400)
        .json({ success: false, message: `No target set for month ${month}` });
    }

    monthRecord.achieved = Number(achieved);
    target.importMeta.importedAt = new Date();
    target.importMeta.importedBy = req.user?.username || "system";

    await target.save();
    logger.info(
      `Achieved updated | targetId=${req.params.id} month=${month} by ${req.user?.username}`
    );
    res.json({ success: true, data: target });
  } catch (err) {
    next(err);
  }
};

// Dashboard summary — last 3 months table
export const getTargetsSummary = async (req, res, next) => {
  try {
    const months = [
      dayjs().format("YYYY-MM"),
      dayjs().subtract(1, "month").format("YYYY-MM"),
      dayjs().subtract(2, "month").format("YYYY-MM"),
    ];

    const targets = await EvkTarget.find({ "months.month": { $in: months } })
      .populate("salesperson", "name email userType department supervisorId supervisorName")
      .lean();

    const rowsMap = new Map();

    for (const t of targets) {
      const sid = t.salesperson ? t.salesperson._id.toString() : `unassigned_${t._id}`;
      const displayName = t.salesperson
        ? t.salesperson.name || t.salesperson.email
        : t.name || "Unassigned";

      if (!rowsMap.has(sid)) {
        rowsMap.set(sid, {
          salespersonId: sid,
          salespersonName: displayName,
          department: t.salesperson?.department || null,
          supervisorId: t.salesperson?.supervisorId || null,
          supervisorName: t.salesperson?.supervisorName || null,
          targets: { [months[2]]: 0, [months[1]]: 0, [months[0]]: 0 },
          achieved: { [months[2]]: 0, [months[1]]: 0, [months[0]]: 0 },
        });
      }

      const row = rowsMap.get(sid);
      for (const m of t.months) {
        if (months.includes(m.month)) {
          row.targets[m.month] = (row.targets[m.month] || 0) + (m.target || 0);
          row.achieved[m.month] = (row.achieved[m.month] || 0) + (m.achieved || 0);
        }
      }
    }

    const rows = Array.from(rowsMap.values()).map((r) => {
      const percent = {};
      for (const m of months) {
        const tgt = r.targets[m] || 0;
        const ach = r.achieved[m] || 0;
        percent[m] = tgt === 0 ? (ach === 0 ? 0 : 100) : Math.round((ach / tgt) * 10000) / 100;
      }
      return {
        salespersonId: r.salespersonId,
        salespersonName: r.salespersonName,
        department: r.department,
        supervisorId: r.supervisorId,
        supervisorName: r.supervisorName,
        targets: months.map((m) => r.targets[m] || 0),
        achieved: months.map((m) => r.achieved[m] || 0),
        percent: months.map((m) => percent[m]),
      };
    });

    const totals = { targets: [0, 0, 0], achieved: [0, 0, 0], percent: [0, 0, 0] };
    rows.forEach((r) => {
      r.targets.forEach((v, i) => (totals.targets[i] += v));
      r.achieved.forEach((v, i) => (totals.achieved[i] += v));
    });
    totals.percent = totals.targets.map((t, i) =>
      t === 0 ? (totals.achieved[i] === 0 ? 0 : 100) : Math.round((totals.achieved[i] / t) * 10000) / 100
    );

    res.json({
      success: true,
      months,
      rows,
      totals,
    });
  } catch (err) {
    next(err);
  }
};
