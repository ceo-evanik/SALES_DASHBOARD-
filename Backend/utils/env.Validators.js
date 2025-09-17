import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// Schema for all required env variables
const envSchema = z.object({
  // 🌐 MongoDB
  MONGO_URI: z.string().url().nonempty("MONGO_URI is required"),

  // 🚀 Server
  PORT: z
    .string()
    .regex(/^\d+$/, "PORT must be a number")
    .transform(Number)
    .default("4000"),

  // 🔑 JWT
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters (use base64/hex secret)"),
  JWT_EXPIRE: z.string().default("1d"),

  // 📊 Zoho Books API
  ZOHO_CLIENT_ID: z.string().nonempty("ZOHO_CLIENT_ID is required"),
  ZOHO_CLIENT_SECRET: z.string().nonempty("ZOHO_CLIENT_SECRET is required"),
  ZOHO_REFRESH_TOKEN: z.string().nonempty("ZOHO_REFRESH_TOKEN is required"),
  ZOHO_ORG_ID: z.string().nonempty("ZOHO_ORG_ID is required"),
});

// Validate and parse
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
