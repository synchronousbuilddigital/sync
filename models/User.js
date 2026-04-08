import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "intern", "client"], default: "intern" },
  mustChangePassword: { type: Boolean, default: true },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
}, { timestamps: true });

// Force refresh model in dev to update enum
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model("User", UserSchema);
