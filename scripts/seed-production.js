const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

// Schemas (Common JS for running via Node directly)
const ProductionItemSchema = new mongoose.Schema({
  title: String,
  category: String,
  videoUrl: String,
  thumbnailUrl: String,
  description: String,
  index: Number,
});

const PartnerLogoSchema = new mongoose.Schema({
  name: String,
  logoUrl: String,
  index: Number,
  videoUrl: String,
  thumbnailUrl: String,
  description: String,
});

const ProductionCategorySchema = new mongoose.Schema({
  name: String,
  image: String,
  index: Number,
  description: String,
});

const ProductionItem = mongoose.models.ProductionItem || mongoose.model("ProductionItem", ProductionItemSchema);
const PartnerLogo = mongoose.models.PartnerLogo || mongoose.model("PartnerLogo", PartnerLogoSchema);
const ProductionCategory = mongoose.models.ProductionCategory || mongoose.model("ProductionCategory", ProductionCategorySchema);

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");

    // 1. Clean existing production data
    await ProductionItem.deleteMany({});
    await PartnerLogo.deleteMany({});
    await ProductionCategory.deleteMany({});

    // 2. Add partner logos
    const logos = [
      { 
        name: "Nike", 
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", 
        index: 1,
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60",
        description: "Nike Air Max - Unleashed Potential commercial showcasing shoe performance."
      },
      { name: "Coca Cola", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg", index: 2 },
      { name: "Google", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", index: 3 },
      { name: "Apple", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", index: 4 },
      { name: "Microsoft", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg", index: 5 }
    ];

    await PartnerLogo.insertMany(logos);
    console.log("Partner Logos seeded!");

    // 3. Add categories
    const categories = [
      { name: "Commercials", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60", index: 1, description: "High-impact promotional media for television and online campaigns." },
      { name: "Social Media", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60", index: 2, description: "Sleek, short-form narratives engineered for viral social engagement." },
      { name: "Short Films", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=60", index: 3, description: "Creative cinematic experiments and long-form visual stories." }
    ];

    await ProductionCategory.insertMany(categories);
    console.log("Production Categories seeded!");

    // 4. Add reels
    const reels = [
      {
        title: "Nike Air Max - Unleashed Potential",
        category: "Commercials",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60",
        description: "A high-octane conceptual advertisement showcasing the responsive cushioning system of the Nike Air Max lineup.",
        index: 1
      },
      {
        title: "Coca Cola - Shared Happiness",
        category: "Commercials",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=60",
        description: "Emotional brand commercial celebrating everyday connections and refreshing moments of sharing Coca Cola.",
        index: 2
      },
      {
        title: "SaaS Platform - Operational Efficiency",
        category: "Social Media",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
        description: "Dynamic micro-video demonstrating the automated analytics framework of a modern SaaS builder application.",
        index: 1
      },
      {
        title: "Synchronous Build - HQ Tour",
        category: "Social Media",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60",
        description: "An insider walkthrough of our design studio, exploring the collaborative workspaces and creative infrastructure.",
        index: 2
      },
      {
        title: "The Silent Canvas",
        category: "Short Films",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=60",
        description: "An award-winning visual monologue exploring urban solitude and artistic renewal in a post-industrial city.",
        index: 1
      }
    ];

    await ProductionItem.insertMany(reels);
    console.log("Production Items (reels) seeded!");

    console.log("Seeding complete. Exiting.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
}

seedData();
