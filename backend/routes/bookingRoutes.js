const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { protect, provider, admin } = require("../middleware/authMiddleware");

router.route("/").post(protect, createBooking).get(protect, getBookings);

router.route("/:id").get(protect, getBookingById);

router.route("/:id/status").put(protect, updateBookingStatus);

module.exports = router;
