const Chat = require("../models/Chat");
const Booking = require("../models/Booking");

// @desc    Get chat by booking ID (or create if not exists)
// @route   GET /api/chats/:bookingId
// @access  Private
const getChatByBookingId = async (req, res) => {
  const { bookingId } = req.params;

  // Verify access
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }

  if (
    booking.customerId.toString() !== req.user._id.toString() &&
    booking.providerId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(401).json({ message: "Not authorized to view this chat" });
    return;
  }

  let chat = await Chat.findOne({ bookingId })
    .populate("customerId", "name")
    .populate("providerId", "name");

  if (!chat) {
    // Create new chat session if it doesn't exist
    chat = await Chat.create({
      bookingId,
      customerId: booking.customerId,
      providerId: booking.providerId,
      messages: [],
    });
    // Re-fetch to populate if needed, or just return basic structure
    chat = await Chat.findById(chat._id)
      .populate("customerId", "name")
      .populate("providerId", "name");
  }

  res.json(chat);
};

// @desc    Send a message
// @route   POST /api/chats/:bookingId/message
// @access  Private
const sendMessage = async (req, res) => {
  const { bookingId } = req.params;
  const { message } = req.body;

  const chat = await Chat.findOne({ bookingId });

  if (chat) {
    if (
      chat.customerId.toString() !== req.user._id.toString() &&
      chat.providerId.toString() !== req.user._id.toString()
    ) {
      res.status(401).json({ message: "Not authorized to send message" });
      return;
    }

    const newMessage = {
      senderId: req.user._id,
      message,
      timestamp: Date.now(),
    };

    chat.messages.push(newMessage);
    await chat.save();
    res.json(chat);
  } else {
    res.status(404).json({ message: "Chat session not found" });
  }
};

module.exports = {
  getChatByBookingId,
  sendMessage,
};
