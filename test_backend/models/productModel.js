const { ObjectId } = require("mongodb");

function createProductDoc(data) {
  return {
    _id: new ObjectId(),
    name: data.name,
    description: data.description,
    category: data.category,
    price: data.price,
    currency: data.currency,
    stock: data.stock,
    tags: data.tags || [],
    images: data.images || [],
    isActive: data.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

module.exports = { createProductDoc, ObjectId };
