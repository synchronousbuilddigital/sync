import dbConnect from "../lib/mongodb.js";
import ClientProject from "../models/ClientProject.js";
import User from "../models/User.js";
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    await dbConnect();
    console.log("Connected to DB");
    
    const projects = await ClientProject.find();
    console.log(`Found ${projects.length} projects`);
    
    for (const p of projects) {
      console.log(`Project: ${p.projectName}, ClientId: ${p.clientId}, Assigned: ${p.assignedIntern}`);
      try {
        await p.populate("clientId");
        console.log("  ClientId populated");
      } catch (e) {
        console.error(`  FAILED to populate clientId: ${e.message}`);
      }
      
      try {
        await p.populate("assignedIntern");
        console.log("  AssignedIntern populated");
      } catch (e) {
        console.error(`  FAILED to populate assignedIntern: ${e.message}`);
      }
    }
  } catch (e) {
    console.error("Test failed:", e);
  } finally {
    process.exit(0);
  }
}

test();
