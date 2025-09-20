const { MongoClient } = require("mongodb");
const uri = "mongodb://addmin:123@localhost:27017";

let client;

async function connectDB() {
  if (!client) client = new MongoClient(uri);
  await client.connect();
  return client;
}

module.exports = { connectDB };
