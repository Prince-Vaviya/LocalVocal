const express = require("express");
const router = express.Router();
const {
  getUnverifiedProviders,
  verifyProvider,
  rejectProvider,
  getFlaggedReviews,
  ignoreReport,
  deleteReview,
  getAdminStats,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

router.use(protect, admin); // All routes require admin

router.get("/providers", getUnverifiedProviders);
router.put("/verify/:id", verifyProvider);
router.delete("/provider/:id", rejectProvider);

router.get("/reports", getFlaggedReviews);
router.put("/reports/:id/ignore", ignoreReport);
router.delete("/reports/:id", deleteReview);

router.get("/stats", getAdminStats);

module.exports = router;
