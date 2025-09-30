const { ObjectId } = require("mongodb");

function createServiceListRequestDoc(data) {
  return {
    _id: new ObjectId(),
    service_id: data.service_id,
    reservation_id: data.reservation_id,
    isActive: data.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

module.exports = { createServiceListRequestDoc, ObjectId };
