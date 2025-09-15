// migrations/mysqlToMongo.js
import mysql from "mysql2/promise";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Salesperson from "../models/salesPerson.Model.js";
import User from "../models/user.Model.js";
import { logger } from "../config/logger.js";

dotenv.config();

const migrateSalespersons = async () => {
  // 1. Connect MySQL
  const mysqlConn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
  });

  // 2. Connect Mongo
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  logger.info("🔄 Starting Salespersons migration...");

  // 3. Fetch from MySQL
  const [rows] = await mysqlConn.execute("SELECT * FROM salespersons");

  for (let row of rows) {
    try {
      // 4. Ensure user exists in Mongo (linked by email ideally)
      let user = await User.findOne({ email: row.email });
      if (!user) {
        user = await User.create({
          name: row.name || "Unknown",
          email: row.email || `legacy_${row.id}@example.com`,
          password: "Legacy#123", // hashed in production
          userType: "sales",
        });
      }

      // 5. Insert/update Salesperson in Mongo
      await Salesperson.findOneAndUpdate(
        { user: user._id },
        {
          user: user._id,
          region: row.region || "N/A",
          target: row.target || 0,
          achieved: row.achieved || 0,
        },
        { upsert: true, new: true }
      );

      logger.info(`✅ Migrated Salesperson: ${row.name}`);
    } catch (err) {
      logger.error(`❌ Failed to migrate row ${row.id}: ${err.message}`);
    }
  }

  logger.info("🎉 Migration complete!");
  await mysqlConn.end();
  await mongoose.disconnect();
};

export default migrateSalespersons;

// Run directly if called with: node migrations/mysqlToMongo.js
if (process.argv[1].includes("mysqlToMongo.js")) {
  migrateSalespersons()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
