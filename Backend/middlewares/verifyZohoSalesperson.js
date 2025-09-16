// backend/middlewares/verifyZohoSalesperson.js
import axios from "axios";

export const verifyZohoSalesperson = async (req, res, next) => {
  try {
    const { userType, salespersonId, name } = req.body;

    // Only validate for sales users
    if (userType !== "sales") return next();

    // ensure both id and name are present
    if (!salespersonId || !name) {
      return res.status(400).json({
        message: "salespersonId and name are required to verify Zoho salesperson",
      });
    }

    // fetch Zoho invoices (be flexible about response shape)
    const response = await axios.get("http://localhost:4003/api/zoho/invoices", { timeout: 5000 });
    const invoices = Array.isArray(response.data)
      ? response.data
      : response.data.invoices || response.data.data || [];

    const normalizedId = String(salespersonId).trim();
    const normalizedName = String(name).trim().toLowerCase();

    // look for a matching invoice record with same id + name
    const salespersonExists = invoices.some((inv) => {
      const invId = inv.salesperson_id ? String(inv.salesperson_id).trim() : "";
      const invName = String(inv.salesperson_name || inv.sales_person || "").trim().toLowerCase();
      return invId === normalizedId && invName === normalizedName;
    });

    if (!salespersonExists) {
      return res.status(400).json({
        message:
          "Salesperson not found in Zoho data. Please verify salespersonId and name (case/spacing sensitive).",
      });
    }

    // passed verification
    next();
  } catch (err) {
    console.error("Zoho verification error:", err.stack || err.message);
    res.status(500).json({ message: "Failed to verify salesperson with Zoho" });
  }
};
