const express = require("express");
const router = express.Router();
const {
  getChatByBookingId,
  sendMessage,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.route("/:bookingId").get(protect, getChatByBookingId);

router.route("/:bookingId/message").post(protect, sendMessage);

module.exports = router;
