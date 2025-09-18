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
      minlength: [6, "Password must be at least 6 characters"],
    },
    contactNo: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    userType: {
      type: String,
      enum: ["superadmin", "admin", "user"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    department: {
      type: String,
      enum: ["sales", "support", null],
      default: null,
    },
    salespersonId: {
      type: String,
      unique: true,
      sparse: true, // ✅ allows multiple nulls
    },
    supervisorId: String,
    supervisorName: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("targets", {
  ref: "EvkTarget",
  localField: "_id",
  foreignField: "userId",
});

export default mongoose.model("User", userSchema);
