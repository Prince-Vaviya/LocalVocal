const Message = require("../models/Message");
const User = require("../models/User");

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;

  try {
    const newMessage = new Message({
      senderId: req.user._id,
      receiverId,
      message,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

// @desc    Get messages between logged in user and another user
// @route   GET /api/chat/:userId
// @access  Private
const getMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id },
      ],
    }).sort({ createdAt: 1 }); // Oldest first

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// @desc    Get list of conversations (users chatted with)
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    // Find unique users communicating with current user
    const messages = await Message.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
    }).sort({ createdAt: -1 });

    const userIds = new Set();
    const conversations = [];

    for (const msg of messages) {
      const otherUserId =
        msg.senderId.toString() === req.user._id.toString()
          ? msg.receiverId.toString()
          : msg.senderId.toString();

      if (!userIds.has(otherUserId)) {
        userIds.add(otherUserId);
        const user = await User.findById(otherUserId).select("name email role");
        if (user) {
          conversations.push({
            user,
            lastMessage: msg.message,
            timestamp: msg.createdAt,
          });
        }
      }
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversations,
};
