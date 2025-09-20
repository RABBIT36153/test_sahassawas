const productService = require("../services/productService");

// CREATE
async function createProduct(req, res) {
  try {
    const product = await productService.create(req.body);
    res.status(200).send({ status: "ok", product });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// READ ALL
async function getAllProducts(req, res) {
  try {
    const data = await productService.getAll(req.query);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// READ BY ID
async function getProductById(req, res) {
  try {
    const product = await productService.getById(req.params.id);
    if (!product) return res.status(404).send({ status: "error", message: "Product not found" });
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// UPDATE
async function updateProduct(req, res) {
  try {
    const updates = {
      ...req.body,
      ...(req.file ? { image: req.file.filename } : {}) 
    };

    const result = await productService.update(req.params.id, updates);

    if (result.matchedCount === 0)
      return res.status(404).send({ status: "error", message: "Product not found" });

    res.status(200).send({ status: "ok", message: "Product updated" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// DELETE
async function deleteProduct(req, res) {
  try {
    const result = await productService.remove(req.params.id);
    if (result.deletedCount === 0) return res.status(404).send({ status: "error", message: "Product not found" });
    res.status(200).send({ status: "ok", message: "Product deleted" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
