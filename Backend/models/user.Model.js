import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    contactNo: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    userType: {
      type: String,
      enum: ["admin", "support", "sales"],
      default: "sales",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String, // <-- Store JWT here
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
