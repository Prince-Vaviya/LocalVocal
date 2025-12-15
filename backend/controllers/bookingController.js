const Booking = require("../models/Booking");

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/Customer
const createBooking = async (req, res) => {
  const { providerId, serviceId, scheduledAt, address, price } = req.body;

  if (req.user.role !== "customer") {
    res.status(400).json({ message: "Only customers can book services" });
    return;
  }

  const booking = new Booking({
    customerId: req.user._id,
    providerId,
    serviceId,
    scheduledAt,
    address,
    price,
    status: "pending",
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  let query = {};
  if (req.user.role === "customer") {
    query = { customerId: req.user._id };
  } else if (req.user.role === "provider") {
    query = { providerId: req.user._id };
  } else if (req.user.role === "admin") {
    // Admin sees all, or filter if needed
  }

  const bookings = await Booking.find(query)
    .populate("serviceId", "title category")
    .populate("customerId", "name email")
    .populate("providerId", "name email");

  res.json(bookings);
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("serviceId", "title category")
    .populate("customerId", "name email location")
    .populate("providerId", "name email");

  if (booking) {
    // Allow access if user is admin, or the customer/provider of the booking
    if (
      req.user.role === "admin" ||
      booking.customerId._id.toString() === req.user._id.toString() ||
      booking.providerId._id.toString() === req.user._id.toString()
    ) {
      res.json(booking);
    } else {
      res.status(401).json({ message: "Not authorized to view this booking" });
    }
  } else {
    res.status(404).json({ message: "Booking not found" });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Provider/Admin
const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    const isProvider =
      booking.providerId.toString() === req.user._id.toString();
    const isCustomer =
      booking.customerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    // Authorization check
    if (!isAdmin && !isProvider && !isCustomer) {
      res
        .status(401)
        .json({ message: "Not authorized to access this booking" });
      return;
    }

    // Role-specific status restrictions (Optional but good practice)
    if (isCustomer) {
      if (!["cancelled", "completed"].includes(status)) {
        res
          .status(400)
          .json({ message: "Customers can only cancel or complete bookings" });
        return;
      }
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404).json({ message: "Booking not found" });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
};
