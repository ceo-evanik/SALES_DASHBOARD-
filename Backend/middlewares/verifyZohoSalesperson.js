// backend/middlewares/verifyZohoSalesperson.js
import axios from "axios";

export const verifyZohoSalesperson = async (req, res, next) => {
  try {
    const { userType, salespersonId, supervisorName } = req.body;

    // Only check if userType is 'sales'
    if (userType !== "sales") return next();

    if (!salespersonId || !supervisorName) {
      return res.status(400).json({ message: "Salesperson ID and Name required" });
    }

    // Fetch Zoho invoices
    const response = await axios.get("http://localhost:4003/api/zoho/invoices");
    const invoices = response.data;

    // Check if any invoice has matching salesperson_id and salesperson_name
    const salespersonExists = invoices.some(
      (inv) =>
        inv.salesperson_id === salespersonId &&
        (inv.salesperson_name === supervisorName || inv.sales_person === supervisorName)
    );

    if (!salespersonExists) {
      return res.status(400).json({
        message: "Salesperson not found in Zoho data. Please verify ID and Name.",
      });
    }

    next();
  } catch (err) {
    console.error("Zoho verification error:", err.message);
    res.status(500).json({ message: "Failed to verify salesperson with Zoho" });
  }
};
