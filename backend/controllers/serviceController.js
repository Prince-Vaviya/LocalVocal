const Service = require("../models/Service");

// @desc    Fetch all services (with optional filters)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const services = await Service.find({ ...keyword }).populate(
    "providerId",
    "name email"
  );
  res.json(services);
};

// @desc    Fetch single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  const service = await Service.findById(req.params.id).populate(
    "providerId",
    "name email"
  );

  if (service) {
    res.json(service);
  } else {
    res.status(404).json({ message: "Service not found" });
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
