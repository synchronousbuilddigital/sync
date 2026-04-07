const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env");
  process.exit(1);
}

// User Schema (Simplified for seeding)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, default: 'admin' },
  mustChangePassword: { type: Boolean, default: false }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");

    const email = "synchronous.build.digital@gmail.com";
    const password = "Devam@56789";

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists. Updating password...");
      const hashedPassword = await bcrypt.hash(password, 10);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
    } else {
      console.log("Creating new admin...");
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name: "Sync System Admin",
        email: email,
        password: hashedPassword,
        role: "admin",
        mustChangePassword: false
      });
    }

    console.log("Admin credentials seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
