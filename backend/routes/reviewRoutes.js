const express = require("express");
const router = express.Router();
const {
  createReview,
  getServiceReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createReview);

router.route("/service/:serviceId").get(getServiceReviews);

module.exports = router;
