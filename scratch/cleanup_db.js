import dbConnect from "../lib/mongodb.js";
import ClientProject from "../models/ClientProject.js";

async function cleanup() {
  await dbConnect();
  const projects = await ClientProject.find({ assignedIntern: "" });
  console.log(`Found ${projects.length} projects with empty string assignedIntern`);
  
  for (const project of projects) {
    project.assignedIntern = null;
    await project.save();
    console.log(`Fixed project ${project.projectName}`);
  }
  
  process.exit(0);
}

cleanup();
