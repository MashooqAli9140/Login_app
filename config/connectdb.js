const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {});
    console.log("connect to database");
  } catch (error) {}
};
module.exports = ConnectDB;
