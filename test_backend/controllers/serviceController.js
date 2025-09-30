const ServiceService = require("../services/serviceService");

// CREATE
async function createService(req, res) {
  try {
    const service = await ServiceService.create(req.body);
    res.status(200).send({ status: "ok", service });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// READ ALL
async function getAllServices(req, res) {
  try {
    const data = await ServiceService.getAll(req.query);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// READ BY ID
async function getServiceById(req, res) {
  try {
    const service = await ServiceService.getById(req.params.id);
    if (!service) return res.status(404).send({ status: "error", message: "service not found" });
    res.status(200).send(service);
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// UPDATE
async function updateService(req, res) {
  try {
    const updates = {
      ...req.body,
      ...(req.file ? { image: req.file.filename } : {}) 
    };

    const result = await ServiceService.update(req.params.id, updates);

    if (result.matchedCount === 0)
      return res.status(404).send({ status: "error", message: "service not found" });

    res.status(200).send({ status: "ok", message: "service updated" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// DELETE
async function deleteService(req, res) {
  try {
    const result = await ServiceService.remove(req.params.id);
    if (result.deletedCount === 0) return res.status(404).send({ status: "error", message: "service not found" });
    res.status(200).send({ status: "ok", message: "service deleted" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

module.exports = { createService, getAllServices, getServiceById, updateService, deleteService };
