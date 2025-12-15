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
const getServiceReviews = async (req, res) => {
  const reviews = await Review.find({
    serviceId: req.params.serviceId,
    isVisible: true,
  }).populate("customerId", "name");
  res.json(reviews);
};

module.exports = {
  createReview,
  getServiceReviews,
};
