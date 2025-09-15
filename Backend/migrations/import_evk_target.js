// migrations/import_evk_target.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import xml2js from "xml2js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import EvkTarget from "../models/evkTarget.Model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("❌ MONGO_URI not found in .env file");

  await mongoose.connect(mongoUri);
  console.log("✅ Connected to MongoDB");

  const xmlPath = path.resolve(__dirname, "../secrets/evk_target.xml");
  if (!fs.existsSync(xmlPath)) {
    throw new Error(`❌ evk_target.xml not found at ${xmlPath}`);
  }

  const xml = fs.readFileSync(xmlPath, "utf8");
  const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false });

  // Debug log first 1000 chars of parsed structure
  console.log("🪵 Full parsed structure preview:");
  console.log(JSON.stringify(parsed, null, 2).slice(0, 1000));

  // ----------------------------
  // Auto-detect row-like elements
  // ----------------------------
  let rows = null;
  const rootValues = Object.values(parsed || {});
  
  for (const root of rootValues) {
    if (root?.row) {
      rows = Array.isArray(root.row) ? root.row : [root.row];
      break;
    }
    // Fallback: any array of objects
    for (const key in root) {
      if (Array.isArray(root[key]) && root[key].length && typeof root[key][0] === "object") {
        rows = root[key];
        break;
      }
    }
    if (rows) break;
  }

  if (!rows || rows.length === 0) {
    throw new Error("❌ Could not locate <row> elements in evk_target.xml — check above preview");
  }

  console.log(`🔹 Found ${rows.length} rows to import.`);

  // ----------------------------
  // Import into MongoDB
  // ----------------------------
  let count = 0;
  for (const r of rows) {
    await EvkTarget.updateOne(
      { evkId: Number(r.id) },
      {
        evkId: Number(r.id),
        revenueStream: r.revenue_stream,
        name: r.name,
        zohoSalespersonId:
          r.zoho_salesperson_id && r.zoho_salesperson_id !== "(NULL)" ? r.zoho_salesperson_id : null,
        date: r.date ? new Date(r.date) : null,
        totalAch: r.total_ach && r.total_ach !== "(NULL)" ? Number(r.total_ach) : null,
        totalTarget: r.total_target && r.total_target !== "(NULL)" ? Number(r.total_target) : null,
        imageUrl: r.image_url && r.image_url !== "(NULL)" ? r.image_url : null,
        importMeta: {
          source: "mysql-evk-xml",
          importedAt: new Date(),
          importedBy: "shashi",
        },
      },
      { upsert: true }
    );
    count++;
  }

  console.log(`🎉 Imported ${count} EVK Targets into MongoDB`);
  const total = await EvkTarget.countDocuments();
  console.log(`📊 Total EVK Targets in DB: ${total}`);

  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
