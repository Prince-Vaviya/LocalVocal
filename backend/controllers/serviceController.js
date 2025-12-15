const Service = require("../models/Service");

// @desc    Fetch all services (with optional filters)
// @route   GET /api/services
// @access  Public
const Review = require("../models/Review");

const getServices = async (req, res) => {
  try {
    const query = { isActive: true };

    if (req.query.keyword) {
      query.title = { $regex: req.query.keyword, $options: "i" };
    }

    if (req.query.provider) {
      query.providerId = req.query.provider;
    }

    // 1. Fetch services
    const services = await Service.find(query)
      .populate("providerId", "name email phone location serviceLocations")
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JS objects to modify them

    // 2. Fetch ratings aggregation
    const serviceIds = services.map((s) => s._id);
    const ratings = await Review.aggregate([
      { $match: { serviceId: { $in: serviceIds }, isVisible: true } },
      {
        $group: {
          _id: "$serviceId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    // 3. Merge ratings into services
    const ratingMap = {};
    ratings.forEach((r) => {
      ratingMap[r._id.toString()] = {
        averageRating: r.averageRating,
        reviewCount: r.reviewCount,
      };
    });

    const servicesWithRatings = services.map((service) => {
      const ratingInfo = ratingMap[service._id.toString()] || {
        averageRating: 0,
        reviewCount: 0,
      };
      return {
        ...service,
        averageRating: parseFloat(ratingInfo.averageRating.toFixed(1)), // Round to 1 decimal
        reviewCount: ratingInfo.reviewCount,
      };
    });

    res.json(servicesWithRatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("providerId", "name email phone location serviceLocations")
      .lean();

    if (service) {
      // Calculate average rating
      const ratings = await Review.aggregate([
        { $match: { serviceId: service._id, isVisible: true } },
        {
          $group: {
            _id: "$serviceId",
            averageRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ]);

      const ratingInfo = ratings[0] || { averageRating: 0, reviewCount: 0 };

      res.json({
        ...service,
        averageRating: parseFloat(ratingInfo.averageRating.toFixed(1)),
        reviewCount: ratingInfo.reviewCount,
      });
    } else {
      res.status(404).json({ message: "Service not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Provider
const createService = async (req, res) => {
  const { title, description, category, price, durationMinutes } = req.body;

  const service = new Service({
    providerId: req.user._id,
    title,
    description,
    category,
    price,
    durationMinutes,
  });

  const createdService = await service.save();
  res.status(201).json(createdService);
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Provider
const updateService = async (req, res) => {
  const { title, description, category, price, durationMinutes, isActive } =
    req.body;

  const service = await Service.findById(req.params.id);

  if (service) {
    if (
      service.providerId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res
        .status(401)
        .json({ message: "Not authorized to update this service" });
      return;
    }

    service.title = title || service.title;
    service.description = description || service.description;
    service.category = category || service.category;
    service.price = price || service.price;
    service.durationMinutes = durationMinutes || service.durationMinutes;
    service.isActive = isActive !== undefined ? isActive : service.isActive;

    const updatedService = await service.save();
    res.json(updatedService);
  } else {
    res.status(404).json({ message: "Service not found" });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Provider
const deleteService = async (req, res) => {
  // Use findByIdAndDelete or service.deleteOne()
  // First finding ensures existence and ownership check
  const service = await Service.findById(req.params.id);

  if (service) {
    if (
      service.providerId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res
        .status(401)
        .json({ message: "Not authorized to delete this service" });
      return;
    }

    await service.deleteOne();
    res.json({ message: "Service removed" });
  } else {
    res.status(404).json({ message: "Service not found" });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
