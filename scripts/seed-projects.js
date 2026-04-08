const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  index: { type: String },
  category: { type: String, default: "Verified Partner" },
  description: { type: String },
  strategyTitle: { type: String, default: "Strategy" },
  strategyDetail: { type: String, default: "Step: Design & Build" },
  happinessTitle: { type: String, default: "Happiness" },
  happinessDetail: { type: String, default: "100% Success" },
  tags: [{ type: String }],
  imageUrl: { type: String, default: "" },
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

const projects = [
  {
    title: "BOXFOX",
    index: "01",
    category: "Verified Partner",
    description: "An easy-to-use custom gift box and 3D design shop.",
    strategyDetail: "Step: Design & Build",
    happinessDetail: "100% Success",
    tags: ["Custom 3D Shop", "Easy Ordering"],
    imageUrl: "/website ss/boxfox.png"
  },
  {
    title: "RYM Grenergy",
    index: "02",
    category: "Verified Partner",
    description: "Smart solar and energy systems for cleaner homes.",
    strategyDetail: "Step: Simple Setup",
    happinessDetail: "100% Success",
    tags: ["Better Solar Energy", "Smarter Saving"],
    imageUrl: "/website ss/RYM.png"
  },
  {
    title: "Vegavruddhi",
    index: "03",
    category: "Verified Partner",
    description: "A helpful app for sales teams to track their work and grow.",
    strategyDetail: "Step: Team Support",
    happinessDetail: "100% Success",
    tags: ["Fast Sales Growth", "Better Tracking"],
    imageUrl: "/website ss/vega.png"
  },
  {
    title: "BWorth",
    index: "04",
    category: "Verified Partner",
    description: "A friendly online store for buying and selling pre-owned clothes.",
    strategyDetail: "Step: Smart Marketplace",
    happinessDetail: "100% Success",
    tags: ["Better Shopping", "Eco Rewards"],
    imageUrl: "/website ss/bworth.png"
  },
  {
    title: "Fashquick",
    index: "05",
    category: "Verified Partner",
    description: "Premium fashion rentals for any occasion starting today.",
    strategyDetail: "Step: Daily Rentals",
    happinessDetail: "100% Success",
    tags: ["Fashion Rental", "Affordable Price"],
    imageUrl: "/website ss/fashquick.png"
  },
  {
    title: "PRL Roadlines",
    index: "06",
    category: "Verified Partner",
    description: "Enterprise-grade vehicle and household relocation platform.",
    strategyDetail: "Step: Logistics Layer",
    happinessDetail: "100% Success",
    tags: ["5000+ Fleet Nodes", "Pan-India Network"],
    imageUrl: "/website ss/prl.png"
  }
];

async function seed() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected. Purging old projects...");
    await Project.deleteMany({});
    console.log("Seeding new project matrix...");
    await Project.insertMany(projects);
    console.log("Success: 6 Projects Deployed to Database.");
    process.exit(0);
  } catch (err) {
    console.error("Critical Seed Failure:", err);
    process.exit(1);
  }
}

seed();
