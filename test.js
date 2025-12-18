require("dotenv").config();
const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB Atlas connected successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(" MongoDB Atlas connection failed:", err.message);
    process.exit(1);
  });
