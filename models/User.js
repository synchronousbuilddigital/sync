import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "intern", "client", "brand_manager"], default: "intern" },
  department: { type: String, enum: ["Tech", "Digital Marketing"], default: "Tech" },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
  mustChangePassword: { type: Boolean, default: true },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Force refresh model in dev to update enum
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model("User", UserSchema);
