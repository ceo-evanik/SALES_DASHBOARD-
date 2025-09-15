import Lead from "../models/lead.Model.js";
import Salesperson from "../models/salesPerson.Model.js";

export const createLead = async (req, res, next) => {
  try {
    // 1️⃣ Ensure the assignedTo is a valid Salesperson ID
    const salesperson = await Salesperson.findById(req.body.assignedTo);
    if (!salesperson) {
      return res.status(400).json({ success: false, message: "Invalid assignedTo: Salesperson not found" });
    }

    // 2️⃣ Create the lead
    const lead = await Lead.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      status: req.body.status || "new",
      assignedTo: salesperson._id,
    });

    // 3️⃣ Populate assignedTo -> Salesperson -> User
    const populatedLead = await Lead.findById(lead._id)
      .populate({
        path: "assignedTo",
        select: "region target achieved user",
        populate: { path: "user", select: "name email userType" },
      });

    // 4️⃣ Send response
    res.status(201).json({ success: true, data: populatedLead });
  } catch (error) {
    next(error);
  }
};


export const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().populate("assignedTo");
    res.json({ success: true, data: leads });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assignedTo");
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, message: "Lead deleted" });
  } catch (error) {
    next(error);
  }
};
