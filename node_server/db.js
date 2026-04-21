const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async () => {
  try {
    await mongoose
      .set("strictQuery", false)
      .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.zycr6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
      );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.log(`❌ db not connected ${error}`);
  }
};