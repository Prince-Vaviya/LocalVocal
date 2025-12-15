const Review = require("../models/Review");
const Booking = require("../models/Booking");

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private/Customer
const createReview = async (req, res) => {
  const { bookingId, serviceId, providerId, rating, comment } = req.body;

  // Verify booking allows review (must be completed and belong to user)
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }

  if (booking.customerId.toString() !== req.user._id.toString()) {
    res.status(401).json({ message: "Not authorized to review this booking" });
    return;
  }

  if (booking.status !== "completed") {
    res.status(400).json({ message: "Can only review completed bookings" });
    return;
  }

  const reviewExists = await Review.findOne({
    bookingId,
    customerId: req.user._id,
  });

  if (reviewExists) {
    res.status(400).json({ message: "Review already submitted" });
    return;
  }

  const review = await Review.create({
    bookingId,
    customerId: req.user._id,
    providerId,
    serviceId,
    rating,
    comment,
  });

  res.status(201).json(review);
};

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
const getReviews = async (req, res) => {
  try {
    const query = { isVisible: true };
    if (req.query.serviceId) query.serviceId = req.query.serviceId;
    if (req.query.provider) query.providerId = req.query.provider;

    const reviews = await Review.find(query)
      .populate("customerId", "name")
      .populate("serviceId", "title")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getReviews,
};
