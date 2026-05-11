
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb://devam:devam@ac-k6xctcz-shard-00-00.eiove8y.mongodb.net:27017,ac-k6xctcz-shard-00-01.eiove8y.mongodb.net:27017,ac-k6xctcz-shard-00-02.eiove8y.mongodb.net:27017/sync?ssl=true&replicaSet=atlas-wld2v7-shard-0&authSource=admin&retryWrites=true&w=majority";

async function test() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");

    const UserSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ["admin", "intern", "client"], default: "intern" },
      mustChangePassword: { type: Boolean, default: true },
    }, { timestamps: true });

    UserSchema.pre("save", async function (next) {
      if (!this.isModified("password")) return next();
      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      } catch (err) {
        next(err);
      }
    });

    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    const testEmail = "test_" + Date.now() + "@example.com";
    console.log("Creating user with email:", testEmail);

    const intern = await User.create({
      name: "Test Intern",
      email: testEmail,
      password: "SyncIntern123",
      role: "intern",
      mustChangePassword: true,
    });

    console.log("User created successfully:", intern.email);
    console.log("Intern object keys:", Object.keys(intern));
    console.log("Intern._doc keys:", Object.keys(intern._doc));

    await User.deleteOne({ email: testEmail });
    console.log("Test user deleted.");

    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
