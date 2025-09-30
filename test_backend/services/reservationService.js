const { connectDB } = require("../utils/db");
const { createReservationDoc, ObjectId } = require("../models/reservationModel");
const ServiceListRequestService = require("../services/ServiceListRequestService");

const dbName = "mydb";
const collectionName = "reservations";

// CREATE
async function create(data) {
  const client = await connectDB();
  const doc = createReservationDoc(data);
  await client.db(dbName).collection(collectionName).insertOne(doc);

  for (const serviceId of data.service_id) {
    await ServiceListRequestService.create({
      reservation_id: doc._id,
      service_id: serviceId
    });
  }
  return doc;
}

// GET ALL
async function getAll(query) {
  const client = await connectDB();
  const collection = client.db(dbName).collection("reservations");

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
        from: "service_list_request",
        let: { reservationId: "$_id" }, 
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$reservation_id", { $toObjectId: "$$reservationId" }] } // แปลง string เป็น ObjectId
            }
          },
          {
          $lookup: {
            from: "services",
            let: { serviceId: "$service_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$serviceId" }] } } }
            ],
            as: "serviceInfo"
          }
        }
        ],
        as: "service_list_requestInfo"
      },
    },
    { $skip: skip },
    { $limit: limit }
  ];

  const reservations = await collection.aggregate(pipeline).toArray();

  return {
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    reservations
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

  const reservation = await collection.aggregate(pipeline).toArray();
  return reservation[0] || null; // findOne แทน
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
