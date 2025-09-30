const { connectDB } = require("../utils/db");
const { createServiceListRequestDoc, ObjectId } = require("../models/serviceListRequestModel");

const dbName = "mydb";
const collectionName = "service_list_request";

// CREATE
async function create(data) {
  const client = await connectDB();
  const doc = createServiceListRequestDoc(data);
  await client.db(dbName).collection(collectionName).insertOne(doc);
  return doc;
}


async function getAll(query) {
  const client = await connectDB();
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  const keyword = query.keyword || "";

  const collection = client.db(dbName).collection(collectionName);
  const regex = new RegExp(keyword, "i");
  const searchQuery = keyword
    ? { $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }] }
    : {};

  const pipeline = [
    { $match: searchQuery },
    { $skip: skip },
    { $limit: limit }
  ];

  const ServiceListRequest = await collection.aggregate(pipeline).toArray();

  return { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit), ServiceListRequest };
}



// READ BY ID
async function getById(id) {
  const client = await connectDB();
  const category = await client.db(dbName).collection(collectionName).findOne({ _id: new ObjectId(id) });
  return category;
}

// UPDATE
async function update(id, updates) {
  const client = await connectDB();
  const result = await client.db(dbName).collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } });
  return result;
}

// DELETE
async function remove(id) {
  const client = await connectDB();
  const result = await client.db(dbName).collection(collectionName).deleteOne({ _id: new ObjectId(id) });
  return result;
}

module.exports = { create, getAll, getById, update, remove };
