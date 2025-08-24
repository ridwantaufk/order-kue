const express = require("express");
const router = express.Router();
const {
  getAllChatSessions,
  getChatSessionsByPhone,
  getChatSessionByOrderCode,
  createChatMessage,
  markMessagesAsRead,
} = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");

// =================== CHAT SESSION ROUTES ===================

// GET all chat sessions for admin view
// Protected: Admin only (assuming middleware handles role or is generic)
router.get("/sessions", authMiddleware, getAllChatSessions);

// GET all chat sessions for a specific buyer by their phone number
// Public: Buyers use this to find their chat history
router.get("/sessions/phone/:phone", getChatSessionsByPhone);

// GET a single chat session by order_code, including all its messages
// Public: Buyers and Admins use this to view a specific chat
router.get("/sessions/order/:order_code", getChatSessionByOrderCode);

// =================== CHAT MESSAGE ROUTES ===================

// POST a new message to a session
// Protected: Both admin and buyer can send messages
router.post("/messages", authMiddleware, createChatMessage);

// PUT mark messages as read in a session
// Protected: Both admin and buyer can trigger this
router.put("/messages/read/:session_id", authMiddleware, markMessagesAsRead);

module.exports = router;
