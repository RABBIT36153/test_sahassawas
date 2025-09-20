const { connectDB } = require("../utils/db");
const { createProductDoc, ObjectId } = require("../models/productModel");

const dbName = "mydb";
const collectionName = "products";

// CREATE
async function create(data) {
  const client = await connectDB();
  const doc = createProductDoc(data);
  await client.db(dbName).collection(collectionName).insertOne(doc);
  return doc;
}

// GET ALL
async function getAll(query) {
  const client = await connectDB();
  const collection = client.db(dbName).collection("products");

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  const keyword = query.keyword || "";
  const regex = new RegExp(keyword, "i");

  const searchQuery = keyword
    ? { $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }] }
    : {};

  const totalItems = await collection.countDocuments(searchQuery);

  const pipeline = [
    { $match: searchQuery },
    {
      $lookup: {
        from: "categorys",
        let: { categoryId: "$category" }, // category เป็น string
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$categoryId" }] } // แปลง string เป็น ObjectId
            }
          }
        ],
        as: "categoryInfo"
      }
    },
    { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
    { $skip: skip },
    { $limit: limit }
  ];

  const products = await collection.aggregate(pipeline).toArray();

  return {
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    products
  };
}






// READ BY ID
async function getById(id) {
  const client = await connectDB();
  const collection = client.db(dbName).collection(collectionName);

  const pipeline = [
    { $match: { _id: new ObjectId(id) } }, // match by id ก่อน
    {
      $lookup: {
        from: "categorys",
        let: { categoryId: { $convert: { input: "$category", to: "objectId", onError: null, onNull: null } } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$categoryId"] }
            }
          }
        ],
        as: "categoryInfo"
      }
    },
    { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } }
  ];

  const products = await collection.aggregate(pipeline).toArray();
  return products[0] || null; // findOne แทน
}

// UPDATE
async function update(id, updates) {
  const client = await connectDB();
  const result = await client
    .db(dbName)
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } });
  return result;
}

module.exports = { create, getAll, getById, update, remove };


// DELETE
async function remove(id) {
  const client = await connectDB();
  const result = await client.db(dbName).collection(collectionName).deleteOne({ _id: new ObjectId(id) });
  return result;
}

module.exports = { create, getAll, getById, update, remove };
