const ReservationService = require("../services/reservationService");

// CREATE
async function createReservation(req, res) {
  try {
    const service = await ReservationService.create(req.body);
    res.status(200).send({ status: "ok", service });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// READ ALL
async function getAllReservations(req, res) {
  try {
    const data = await ReservationService.getAll(req.query);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// READ BY ID
async function getReservationById(req, res) {
  try {
    const service = await ReservationService.getById(req.params.id);
    if (!service) return res.status(404).send({ status: "error", message: "service not found" });
    res.status(200).send(service);
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// UPDATE
async function updateReservation(req, res) {
  try {
    const updates = {
      ...req.body,
      ...(req.file ? { image: req.file.filename } : {}) 
    };

    const result = await ReservationService.update(req.params.id, updates);

    if (result.matchedCount === 0)
      return res.status(404).send({ status: "error", message: "service not found" });

    res.status(200).send({ status: "ok", message: "service updated" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

// DELETE
async function deleteReservation(req, res) {
  try {
    const result = await ReservationService.remove(req.params.id);
    if (result.deletedCount === 0) return res.status(404).send({ status: "error", message: "service not found" });
    res.status(200).send({ status: "ok", message: "service deleted" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
}

module.exports = { createReservation, getAllReservations, getReservationById, updateReservation, deleteReservation };
