const User = require("../models/User");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Service = require("../models/Service");

// @desc    Get all unverified providers
// @route   GET /api/admin/providers
// @access  Private/Admin
const getUnverifiedProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: "provider", isVerified: false });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching providers" });
  }
};

// @desc    Verify a provider
// @route   PUT /api/admin/verify/:id
// @access  Private/Admin
const verifyProvider = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true } // Return updated doc
    );
    if (user) {
      res.json({ message: "Provider verified successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error verifying provider" });
  }
};

// @desc    Reject/Delete a provider
// @route   DELETE /api/admin/provider/:id
// @access  Private/Admin
const rejectProvider = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "Provider rejected and removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error rejecting provider" });
  }
};

// @desc    Get flagged reviews
// @route   GET /api/admin/reports
// @access  Private/Admin
const getFlaggedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isFlagged: true })
      .populate("customerId", "name")
      .populate("serviceId", "title")
      .populate("providerId", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports" });
  }
};

// @desc    Ignore report (Unflag review)
// @route   PUT /api/admin/reports/:id/ignore
// @access  Private/Admin
const ignoreReport = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      review.isFlagged = false;
      await review.save();
      res.json({ message: "Report ignored, review kept" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error ignoring report" });
  }
};

// @desc    Delete review (Accept report)
// @route   DELETE /api/admin/reports/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      await review.deleteOne();
      res.json({ message: "Review deleted" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting review" });
  }
};

// @desc    Get Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    // 1. Waitlist: Unverified Providers
    const waitlistCount = await User.countDocuments({
      role: "provider",
      isVerified: false,
    });

    // 2. Total Services: All services
    const activeServicesCount = await Service.countDocuments({});

    // 3. Revenue: Sum of price for completed bookings
    const revenueAggregation = await Booking.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalRevenue =
      revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    res.json({
      waitlist: waitlistCount,
      services: activeServicesCount,
      revenue: totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

module.exports = {
  getUnverifiedProviders,
  verifyProvider,
  rejectProvider,
  getFlaggedReviews,
  ignoreReport,
  deleteReview,
  getAdminStats,
};
