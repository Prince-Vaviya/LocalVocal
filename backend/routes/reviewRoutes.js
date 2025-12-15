const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviews,
  toggleFlagReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getReviews).post(protect, createReview);
router.route("/:id/flag").put(protect, toggleFlagReview);

// Keep this for backward compatibility if any component uses it, but reuse getReviews
router.route("/service/:serviceId").get((req, res, next) => {
  req.query.serviceId = req.params.serviceId;
  getReviews(req, res);
});

module.exports = router;
