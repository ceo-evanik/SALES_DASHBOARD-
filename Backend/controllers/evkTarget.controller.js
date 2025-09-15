import EvkTarget from "../models/evkTarget.Model.js";

export const createTarget = async (req, res, next) => {
  try {
    const target = await EvkTarget.create(req.body);
    res.status(201).json({ success: true, data: target });
  } catch (error) {
    next(error);
  }
};

export const getTargets = async (req, res, next) => {
  try {
    const targets = await EvkTarget.find().populate("salesperson");
    res.json({ success: true, data: targets });
  } catch (error) {
    next(error);
  }
};

export const getTargetById = async (req, res, next) => {
  try {
    const target = await EvkTarget.findById(req.params.id).populate("salesperson");
    if (!target) return res.status(404).json({ success: false, message: "Target not found" });
    res.json({ success: true, data: target });
  } catch (error) {
    next(error);
  }
};

export const updateTarget = async (req, res, next) => {
  try {
    const target = await EvkTarget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!target) return res.status(404).json({ success: false, message: "Target not found" });
    res.json({ success: true, data: target });
  } catch (error) {
    next(error);
  }
};

export const deleteTarget = async (req, res, next) => {
  try {
    const target = await EvkTarget.findByIdAndDelete(req.params.id);
    if (!target) return res.status(404).json({ success: false, message: "Target not found" });
    res.json({ success: true, message: "Target deleted" });
  } catch (error) {
    next(error);
  }
};
