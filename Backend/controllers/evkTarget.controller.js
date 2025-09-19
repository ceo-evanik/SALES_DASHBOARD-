import EvkTarget from "../models/evkTarget.Model.js";
import { logger } from "../config/logger.js";
import { validationResult } from "express-validator";
import axios from "axios";


export const createTarget = async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ success: false, errors: errs.array() });
    }

    // normalize date to first day of month in UTC
    const d = new Date(req.body.date);
    const normalizedDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), 1));

    // Check uniqueness: user + month + revenueStream
    const existing = await EvkTarget.findOne({
      userId: req.body.userId,
      revenueStream: req.body.revenueStream,
      date: normalizedDate,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Target for this user, month, and revenue stream already exists",
      });
    }

    const target = new EvkTarget({
      ...req.body,
      date: normalizedDate,
      importMeta: {
        source: "manual-create",
        importedAt: new Date(),
        importedBy: req.user?.username || "system",
      },
    });

    await target.save();

    // format response: always YYYY-MM-DD for frontend
    const targetObj = target.toObject();
    targetObj.date = `${normalizedDate.getUTCFullYear()}-${String(
      normalizedDate.getUTCMonth() + 1
    ).padStart(2, "0")}-01`;

    logger.info(`Target created | evkId=${target.evkId} by ${req.user?.username}`);
    res.status(201).json({ success: true, data: targetObj });
  } catch (err) {
    next(err);
  }
};


import mongoose from "mongoose";


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

    const { date, revenueStream, totalTarget, totalAch, imageUrl } = req.body;
    const userId = req.params.id; // ✅ FIXED

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required (YYYY-MM-DD format)",
      });
    }

    // parse incoming date -> get month range
    const inputDate = new Date(date);
    if (isNaN(inputDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format, expected YYYY-MM-DD",
      });
    }

    const year = inputDate.getUTCFullYear();
    const mon = inputDate.getUTCMonth(); // 0-based

    const monthStart = new Date(Date.UTC(year, mon, 1));
    const monthEnd = new Date(Date.UTC(year, mon + 1, 0, 23, 59, 59, 999));

    // find the target for this user + month + revenueStream
    const target = await EvkTarget.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      ...(revenueStream ? { revenueStream } : {}), // revenueStream optional
      date: { $gte: monthStart, $lte: monthEnd },
    });

    if (!target) {
      return res.status(404).json({
        success: false,
        message: `Target not found for ${date} (userId=${userId})`,
      });
    }

    if (totalTarget !== undefined) target.totalTarget = totalTarget;
    if (totalAch !== undefined) target.totalAch = totalAch;
    if (imageUrl !== undefined) target.imageUrl = imageUrl;

    target.importMeta = {
      ...target.importMeta,
      importedAt: new Date(),
      importedBy: req.user?.username || "system",
    };

    await target.save();

    logger.info(
      `Target updated | userId=${userId} date=${date} by ${req.user?.username}`
    );
    res.json({ success: true, data: target });
  } catch (err) {
    next(err);
  }
};







export const getTargets = async (req, res, next) => {
  try {
    const targets = await EvkTarget.find()
      .populate(
        "userId",
        "name email userType supervisorId supervisorName department contactNo"
      );

    // Fetch all invoices once
    const { data } = await axios.get(
      "http://localhost:4003/api/zoho/invoices",
      {
        headers: { Authorization: `Zoho-oauthtoken ${process.env.ZOHO_TOKEN}` },
      }
    );
    const invoices = Array.isArray(data) ? data : data.data || [];

    // Enrich targets
    const enriched = targets.map((t) => {
      const tObj = t.toObject();

      // Rename userId → user
      tObj.user = tObj.userId;
      delete tObj.userId;

      if (!t.zohoSalespersonId || !t.date) return tObj;

      const startOfMonth = new Date(t.date);
      startOfMonth.setUTCDate(1);
      startOfMonth.setUTCHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1);

      // Filter invoices for this salesperson and month
      const matched = invoices.filter((inv) => {
        const invDate = new Date(inv.date);
        return (
          String(inv.salesperson_id) === String(t.zohoSalespersonId) &&
          invDate >= startOfMonth &&
          invDate < endOfMonth
        );
      });


      tObj.matchedCount = matched.length;
      tObj.totalAch = matched.reduce((sum, inv) => sum + (inv.total || 0), 0);

      return tObj;
    });

    res.json({ success: true, data: enriched });
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



export const getTargetsSummary = async (req, res, next) => {
  try {
    const targets = await EvkTarget.find();

    // 1️⃣ Fetch all Zoho invoices
    const { data } = await axios.get("http://localhost:4003/api/zoho/invoices", {
      headers: { Authorization: `Zoho-oauthtoken ${process.env.ZOHO_TOKEN}` },
    });
    const invoices = Array.isArray(data) ? data : data.data || [];

    // 2️⃣ Calculate totalAch for each target from Zoho invoices
    targets.forEach(t => {
      const startOfMonth = new Date(t.date);
      startOfMonth.setUTCDate(1);
      startOfMonth.setUTCHours(0, 0, 0, 0);
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1);

      const matched = invoices.filter(inv => {
        const invDate = new Date(inv.date);
        return (
          String(inv.salesperson_id) === String(t.zohoSalespersonId) &&
          invDate >= startOfMonth &&
          invDate < endOfMonth
        );
      });

      const zohoTotal = matched.reduce((sum, inv) => sum + (inv.total || 0), 0);

      // Combine with local months array (if exists)
      const monthsTotal = Array.isArray(t.months)
        ? t.months.reduce((sum, m) => sum + (m.achieved || 0), 0)
        : 0;

      t.totalAch = zohoTotal + monthsTotal;
    });

    // 3️⃣ Aggregate summary
    const summary = {
      Renewal: { target: 0, achieved: 0, percent: 0 },
      Acquisition: { target: 0, achieved: 0, percent: 0 },
      Total: { target: 0, achieved: 0, percent: 0 },
    };

    targets.forEach(t => {
      const stream = t.revenueStream?.toLowerCase();
      const targetValue = t.totalTarget || 0;
      const achievedValue = t.totalAch || 0;

      if (stream === "renewal") {
        summary.Renewal.target += targetValue;
        summary.Renewal.achieved += achievedValue;
      } else {
        summary.Acquisition.target += targetValue;
        summary.Acquisition.achieved += achievedValue;
      }
    });

    summary.Renewal.percent = summary.Renewal.target
      ? (summary.Renewal.achieved / summary.Renewal.target) * 100
      : 0;
    summary.Acquisition.percent = summary.Acquisition.target
      ? (summary.Acquisition.achieved / summary.Acquisition.target) * 100
      : 0;
    summary.Total.target = summary.Renewal.target + summary.Acquisition.target;
    summary.Total.achieved = summary.Renewal.achieved + summary.Acquisition.achieved;
    summary.Total.percent = summary.Total.target
      ? (summary.Total.achieved / summary.Total.target) * 100
      : 0;

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

