const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

console.log("Testing connection to:", MONGODB_URI.substring(0, 30) + "...");

mongoose.set('strictQuery', false);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connection successful!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });
