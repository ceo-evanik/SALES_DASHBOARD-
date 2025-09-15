import Salesperson from "../models/salesPerson.Model.js";

export const createSalesperson = async (req, res, next) => {
  try {
    const sp = await Salesperson.create(req.body);
    res.status(201).json({ success: true, data: sp });
  } catch (error) {
    next(error);
  }
};

export const getSalespersons = async (req, res, next) => {
  try {
    const salespersons = await Salesperson.find().populate("user");
    res.json({ success: true, data: salespersons });
  } catch (error) {
    next(error);
  }
};

export const getSalespersonById = async (req, res, next) => {
  try {
    const sp = await Salesperson.findById(req.params.id).populate("user");
    if (!sp) return res.status(404).json({ success: false, message: "Salesperson not found" });
    res.json({ success: true, data: sp });
  } catch (error) {
    next(error);
  }
};

export const updateSalesperson = async (req, res, next) => {
  try {
    const sp = await Salesperson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sp) return res.status(404).json({ success: false, message: "Salesperson not found" });
    res.json({ success: true, data: sp });
  } catch (error) {
    next(error);
  }
};

export const deleteSalesperson = async (req, res, next) => {
  try {
    const sp = await Salesperson.findByIdAndDelete(req.params.id);
    if (!sp) return res.status(404).json({ success: false, message: "Salesperson not found" });
    res.json({ success: true, message: "Salesperson deleted" });
  } catch (error) {
    next(error);
  }
};
