const { ObjectId } = require("mongodb");

function createServiceDoc(data) {
  return {
    _id: new ObjectId(),
    name: data.name, // ชื่อบริการ เช่น "นวดแผนไทย"
    description: data.description, // รายละเอียดบริการ
    category: data.category, // หมวดหมู่ เช่น "นวดและสปา"
    price: data.price, // ราคา
    currency: data.currency || "THB", // ค่าเงิน
    duration: data.duration || 60, // ระยะเวลาบริการ (นาที)
    tags: data.tags || [], // tag เช่น ["สุขภาพ", "ผ่อนคลาย"]
    images: data.images || [], // รูปภาพประกอบ
    isActive: data.isActive ?? true, // เปิด/ปิดการใช้งาน
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

module.exports = { createServiceDoc, ObjectId };
