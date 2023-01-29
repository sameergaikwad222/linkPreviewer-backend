const mongoose = require("mongoose");

// Connection URI
let env =
  process.env.NODE_ENV === "prod"
    ? require("../config/config.json")["prod"]
    : require("../config/config.json")["dev"];

const uri = env.dbUri;

async function connectDatabase() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log("Connected successfully to Mongo Database");
  } catch (e) {
    console.log(e);
  }
}

module.exports = { connectDatabase };
