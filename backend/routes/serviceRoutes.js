const express = require("express");
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect, provider } = require("../middleware/authMiddleware");

router.route("/").get(getServices).post(protect, provider, createService);

router
  .route("/:id")
  .get(getServiceById)
  .put(protect, provider, updateService)
  .delete(protect, provider, deleteService);

module.exports = router;
