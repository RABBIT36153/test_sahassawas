const { ObjectId } = require("mongodb");

function createCategoryDoc(data) {
  return {
    _id: new ObjectId(),
    name: data.name,
    description: data.description || "",
    isActive: data.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

module.exports = { createCategoryDoc, ObjectId };
