import Invoice from "../models/invoice.Model.js";
import { getZohoBooksInvoices } from "../services/zohoService.js";

/**
 * Sync invoices from Zoho Books → Mongo
 * - Admin/Manager only
 */
export const syncInvoicesFromZoho = async (req, res, next) => {
  try {
    const invoices = await getZohoBooksInvoices();

    let inserted = 0;
    let updated = 0;

    for (const inv of invoices) {
      const existing = await Invoice.findOne({ zohoInvoiceId: inv.invoice_id });

      if (existing) {
        // Update existing invoice
        await Invoice.updateOne(
          { zohoInvoiceId: inv.invoice_id },
          {
            $set: {
              invoiceNumber: inv.invoice_number,
              salespersonName: inv.salesperson_name,
              salespersonZohoId: inv.salesperson_id,
              customerName: inv.customer_name,
              customerGstin: inv.gstin || null,
              total: parseFloat(inv.total),
              date: new Date(inv.date),
              raw: inv,
              syncedAt: new Date(),
            },
          }
        );
        updated++;
      } else {
        // Insert new invoice
        await Invoice.create({
          zohoInvoiceId: inv.invoice_id,
          invoiceNumber: inv.invoice_number,
          salespersonName: inv.salesperson_name,
          salespersonZohoId: inv.salesperson_id,
          customerName: inv.customer_name,
          customerGstin: inv.gstin || null,
          total: parseFloat(inv.total),
          date: new Date(inv.date),
          raw: inv,
          syncedAt: new Date(),
        });
        inserted++;
      }
    }

    res.json({
      success: true,
      message: "Zoho invoices synced successfully",
      inserted,
      updated,
      total: invoices.length,
    });
  } catch (error) {
    console.error("❌ Error syncing Zoho invoices:", error.message);
    next(error);
  }
};

/**
 * Create invoice manually (if needed)
 */
export const createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all invoices
 */
export const getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find().populate("salesperson");
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single invoice by ID
 */
export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("salesperson");
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

/**
 * Update invoice by ID
 */
export const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete invoice by ID
 */
export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    res.json({ success: true, message: "Invoice deleted" });
  } catch (error) {
    next(error);
  }
};
