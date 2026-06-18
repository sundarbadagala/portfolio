const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async () => {
  try {
    await mongoose
      .set("strictQuery", false)
      // .connect(
      //   `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.zycr6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
      // );
      .connect(
        `mongodb://sundarbadagala:${process.env.MONGO_PASSWORD}@cluster0-shard-00-00.zycr6.mongodb.net:27017,cluster0-shard-00-01.zycr6.mongodb.net:27017,cluster0-shard-00-02.zycr6.mongodb.net:27017/?ssl=true&replicaSet=atlas-twmcx5-shard-0&authSource=admin&appName=Cluster0`,
      );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
