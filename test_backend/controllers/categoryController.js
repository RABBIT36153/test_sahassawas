const categoryService = require("../services/categoryService");

// CREATE
async function createCategory(req, res) {
  try {
    const category = await categoryService.create(req.body);
    res.status(200).send({ status: "kk", category });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// READ ALL
async function getAllCategoryes(req, res) {
  try {
    const data = await categoryService.getAll(req.query);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// READ BY ID
async function getCategoryById(req, res) {
  try {
    const category = await categoryService.getById(req.params.id);
    if (!category) return res.status(404).send({ status: "error", message: "Category not found" });
    res.status(200).send(category);
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// UPDATE
async function updateCategory(req, res) {
  try {
    const result = await categoryService.update(req.params.id, req.body);
    if (result.matchedCount === 0) return res.status(404).send({ status: "error", message: "Category not found" });
    res.status(200).send({ status: "ok", message: "Category updated" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// DELETE
async function deleteCategory(req, res) {
  try {
    const result = await categoryService.remove(req.params.id);
    if (result.deletedCount === 0) return res.status(404).send({ status: "error", message: "Category not found" });
    res.status(200).send({ status: "ok", message: "Category deleted" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

module.exports = { createCategory, getAllCategoryes, getCategoryById, updateCategory, deleteCategory };
