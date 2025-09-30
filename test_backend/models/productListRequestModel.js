const { ObjectId } = require("mongodb");

function createProductListRequestDoc(data) {
  return {
    product_list_request_id: new ObjectId(),
    product_id: data.product_id,
    Reservation_id: data.reservation_id,
    isActive: data.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

module.exports = { createProductListRequestDoc, ObjectId };
