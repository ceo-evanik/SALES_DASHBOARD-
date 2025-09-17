// src/services/zohoService.js
import axios from "axios";
import moment from "moment";
import { getAccessToken } from "./zohoToken.js";
import dotenv from "dotenv";
dotenv.config();

const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
const orgId = process.env.ZOHO_ORG_ID;

async function zohoRequest(endpoint) {
  const token = await getAccessToken(clientId, clientSecret, refreshToken);
  const url = `https://www.zohoapis.com/books/v3/${endpoint}${
    endpoint.includes("?") ? "&" : "?"
  }organization_id=${orgId}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });
  return data;
}

export async function getZohoBooksInvoices() {
  const data = await zohoRequest("invoices?per_page=200");
  let invoices = data.invoices || [];
  invoices = invoices.map((inv) => ({
    ...inv,
    date: inv.date ? moment(inv.date).format("YYYY-MM-DD") : null,
    sales_person: inv.salesperson_name || "N/A",
  }));
  invoices.sort((a, b) => new Date(b.date) - new Date(a.date));
  return invoices;
}

export async function getUnpaidInvoices() {
  const data = await zohoRequest("invoices?status=unpaid&per_page=200");
  return data.invoices || [];
}

export async function getSalespersonUnpaidTotals() {
  const unpaid = await getUnpaidInvoices();
  const totals = {};
  unpaid.forEach((inv) => {
    const sp = inv.salesperson_name || "Unknown";
    totals[sp] = (totals[sp] || 0) + parseFloat(inv.balance || 0);
  });
  return totals;
}

export async function getZohoBooksEstimates() {
  const data = await zohoRequest("estimates?per_page=200");
  return data.estimates || [];
}

export async function getSalespersonCurrentMonthSummary() {
  const start = moment().startOf("month").format("YYYY-MM-DD");
  const end = moment().endOf("month").format("YYYY-MM-DD");

  const data = await zohoRequest(
    `invoices?date_start=${start}&date_end=${end}&per_page=200`
  );

  const summary = {};
  (data.invoices || []).forEach((inv) => {
    const sp = inv.salesperson_name || "Unknown";
    if (!summary[sp]) {
      summary[sp] = { total: 0, count: 0 };
    }
    summary[sp].total += parseFloat(inv.total || 0);
    summary[sp].count += 1;
  });

  return summary;
}

export async function getOverallUnpaidInvoices() {
  const unpaid = await getUnpaidInvoices();
  return unpaid.reduce((sum, inv) => sum + parseFloat(inv.balance || 0), 0);
}

// 🔒 FIXED: stream PDF securely (no token in URL exposed)
export async function downloadInvoicePDF(invoiceId) {
  const token = await getAccessToken(clientId, clientSecret, refreshToken);
  const url = `https://www.zohoapis.com/books/v3/invoices/${invoiceId}/pdf?organization_id=${orgId}`;

  const res = await axios.get(url, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
    responseType: "arraybuffer",
  });

  return res.data; // raw PDF buffer
}
