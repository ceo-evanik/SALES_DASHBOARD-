import Text from "../models/text.Model.js";
import { logger } from "../config/logger.js";

// -------------------- Create Mission Text --------------------
export const createText = async (req, res, next) => {
  try {
    const { title, content, effectiveDate } = req.body;

    if (!title || !content || !effectiveDate) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user missing" });
    }

    const text = await Text.create({
      title,
      content,
      effectiveDate,
      createdBy: req.user._id,
    });

    logger.info(`Admin(${req.user._id.toString()}) created mission text`);
    res
      .status(201)
      .json({ success: true, message: "Mission text created", data: text });
  } catch (err) {
    next(err);
  }
};

// -------------------- Get All Mission Texts --------------------
export const getAllTexts = async (req, res, next) => {
  try {
    const texts = await Text.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");
    res.json({ success: true, data: texts });
  } catch (err) {
    next(err);
  }
};

// -------------------- Get Single Mission Text --------------------
export const getTextById = async (req, res, next) => {
  try {
    const text = await Text.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!text)
      return res
        .status(404)
        .json({ success: false, message: "Mission text not found" });
    res.json({ success: true, data: text });
  } catch (err) {
    next(err);
  }
};

// -------------------- Update Mission Text (Admin Only) --------------------
export const updateText = async (req, res, next) => {
  try {
    const text = await Text.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!text)
      return res
        .status(404)
        .json({ success: false, message: "Mission text not found" });

    logger.info(
      `Admin(${req.user?._id?.toString() || "unknown"}) updated mission text`
    );
    res.json({
      success: true,
      message: "Mission text updated",
      data: text,
    });
  } catch (err) {
    next(err);
  }
};

// -------------------- Delete Mission Text (Admin Only) --------------------
export const deleteText = async (req, res, next) => {
  try {
    const text = await Text.findByIdAndDelete(req.params.id);
    if (!text)
      return res
        .status(404)
        .json({ success: false, message: "Mission text not found" });

    logger.info(
      `Admin(${req.user?._id?.toString() || "unknown"}) deleted mission text`
    );
    res.json({ success: true, message: "Mission text deleted" });
  } catch (err) {
    next(err);
  }
};
