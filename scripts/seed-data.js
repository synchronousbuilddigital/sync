const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, default: 'intern' },
  mustChangePassword: { type: Boolean, default: false }
});

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  internId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: String,
  priority: String,
  category: String,
  tags: [String],
  estimatedHours: Number,
  dueDate: Date,
  isApproved: Boolean,
  note: String,
  discussion: [{ sender: String, content: String, timestamp: Date }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database connected...");

    // 1. Wipe existing tasks and interns (optional, but good for clean seeding)
    // await Task.deleteMany({});
    // await User.deleteMany({ role: 'intern' });

    const password = await bcrypt.hash("SyncIntern123", 10);

    const interns = [
      { name: "Aarav Sharma", email: "aarav@sync.com" },
      { name: "Ishani Gupta", email: "ishani@sync.com" },
      { name: "Rohan Varma", email: "rohan@sync.com" },
      { name: "Ananya Iyer", email: "ananya@sync.com" }
    ];

    const createdInterns = [];
    for (const data of interns) {
      let user = await User.findOne({ email: data.email });
      if (!user) {
        user = await User.create({ ...data, password, role: 'intern' });
      }
      createdInterns.push(user);
    }

    console.log(`Seeded ${createdInterns.length} interns.`);

    const taskTemplates = [
      { 
        title: "Landing Page Architecture", 
        description: "Develop the frontend structure for the new Synchronous landing page with ultra-high fidelity.", 
        category: "Development", 
        priority: "High", 
        tags: ["frontend", "hero", "animations"] 
      },
      { 
        title: "Corporate Identity Design", 
        description: "Create brand guidelines and high-res assets for the BWorth conglomerate division.", 
        category: "Design", 
        priority: "Medium", 
        tags: ["branding", "assets"] 
      },
      { 
        title: "API Performance Audit", 
        description: "Analyze response times and optimize MongoDB queries for the internship tracker.", 
        category: "Research", 
        priority: "High", 
        tags: ["backend", "performance", "mongodb"] 
      },
      { 
        title: "System Documentation V2", 
        description: "Update the internal deployment guide and onboarding manual for new interns.", 
        category: "Documentation", 
        priority: "Low", 
        tags: ["docs", "guide"] 
      },
      { 
        title: "Auth Leak Investigation", 
        description: "Security drill to ensure all JWT secrets are properly rotated and handled.", 
        category: "Bug Fix", 
        priority: "High", 
        tags: ["security", "auth"] 
      },
      { 
        title: "Weekly Roadmap Planning", 
        description: "Outline tactical objectives for the next development cycle.", 
        category: "Planning", 
        priority: "Medium", 
        tags: ["roadmap", "managements"] 
      },
      { 
        title: "Mobile Viewport Optimization", 
        description: "Ensure the management console is responsive across all devices.", 
        category: "Bug Fix", 
        priority: "Medium", 
        tags: ["responsiveness", "frontend"] 
      },
      { 
        title: "Database Indexing Strategy", 
        description: "Implement compound indexes for search performance optimization.", 
        category: "Development", 
        priority: "High", 
        tags: ["database", "indexes"] 
      },
      { 
        title: "User Persona Research", 
        description: "Analyze user interactions to improve dashboard accessibility.", 
        category: "Research", 
        priority: "Low", 
        tags: ["ux", "research"] 
      },
      { 
        title: "SVG Animation Engine", 
        description: "Build a reusable engine for SVG-based micro-animations.", 
        category: "Development", 
        priority: "Medium", 
        tags: ["svg", "animations", "creative"] 
      }
    ];

    const statuses = ["Pending", "Complete", "Need Credentials", "Need Meeting"];
    
    // Create ~30 tasks with varied dates
    for (let i = 0; i < 30; i++) {
      const intern = createdInterns[i % createdInterns.length];
      const template = taskTemplates[i % taskTemplates.length];
      
      const status = i < 15 ? "Complete" : statuses[Math.floor(Math.random() * statuses.length)];
      
      // Variations in dates to fill the 7-day chart
      const now = new Date();
      const date = new Date();
      date.setDate(now.getDate() - (i % 7)); // Spread evenly across the week

      const task = {
        ...template,
        title: `${template.title} #${i+1}`,
        internId: intern._id,
        status: status,
        isApproved: status === "Complete" && Math.random() > 0.3,
        estimatedHours: Math.floor(Math.random() * 10) + 2,
        dueDate: new Date(now.getTime() + (Math.random() * 7 * 24 * 3600 * 1000)),
        createdAt: date,
        updatedAt: date,
        discussion: [
          { sender: 'admin', content: 'Objective set. Please brief on arrival.', timestamp: date },
          { sender: 'intern', content: 'Acknowledged. Strategy finalized.', timestamp: new Date(date.getTime() + 3600000) }
        ]
      };

      await Task.create(task);
    }

    console.log("Seeding complete. System fully populated.");
    process.exit(0);

  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedData();
