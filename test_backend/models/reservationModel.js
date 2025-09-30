const { ObjectId } = require("mongodb");

function createReservationDoc(data) {
  return {
    _id: new ObjectId(),
    // service_list_request_id: data.service_list_request_id || [], //รากการ บริการ
    // product_list_request_id: data.service_list_request_id || [], //รากการ สินค้า
    service_price_total: data.service_price_total, //ราคา บริการ
    product_price_total: data.product_price_total, //ราคา สินค้า
    price_total: data.price_total, //ราคารวม
    duration_total: data.duration_total || 0, // ระยะเวลาบริการ (นาที)
    // responsible_person_list_code: data.responsible_person_list_code || [],
    status: data.status,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

module.exports = { createReservationDoc, ObjectId };
