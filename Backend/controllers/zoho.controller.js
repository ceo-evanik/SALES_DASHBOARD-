import {
  getZohoBooksInvoices,
  getUnpaidInvoices,
  getSalespersonUnpaidTotals,
  getZohoBooksEstimates,
  getSalespersonCurrentMonthSummary,
  getOverallUnpaidInvoices,
  getInvoicePortalUrl,
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

// 🔒 Return portal URL instead of PDF buffer
export const fetchInvoicePdfUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const url = await getInvoicePortalUrl(id);
    res.json({ portal_url: url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
