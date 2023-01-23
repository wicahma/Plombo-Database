const mongoose = require("mongoose");
require("dotenv").config();

const MongoConnection = async () => {
  try {
    const conn = await mongoose
      .set("strictQuery", false)
      .connect(process.env.MONGO_URI);
    console.log(`Database Connected ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = MongoConnection;
