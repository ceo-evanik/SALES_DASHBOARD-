// src/controllers/zohoController.js
import {
  getZohoBooksInvoices,
  getUnpaidInvoices,
  getSalespersonUnpaidTotals,
  getZohoBooksEstimates,
  getSalespersonCurrentMonthSummary,
  getOverallUnpaidInvoices,
  downloadInvoicePDF,
} from "../services/zohoService.js";

export const fetchInvoices = async (req, res) => {
  try {
    res.json(await getZohoBooksInvoices());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchUnpaidInvoices = async (req, res) => {
  try {
    res.json(await getUnpaidInvoices());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchUnpaidTotals = async (req, res) => {
  try {
    res.json(await getSalespersonUnpaidTotals());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchEstimates = async (req, res) => {
  try {
    res.json(await getZohoBooksEstimates());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchMonthlySummary = async (req, res) => {
  try {
    res.json(await getSalespersonCurrentMonthSummary());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchOverallUnpaid = async (req, res) => {
  try {
    res.json(await getOverallUnpaidInvoices());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔒 FIXED: Return PDF directly instead of exposing URL
export const fetchInvoicePdfUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const pdfBuffer = await downloadInvoicePDF(id);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice_${id}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
