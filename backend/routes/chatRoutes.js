// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Chat Sessions
router.get("/sessions", chatController.getAllChatSessions);
router.get("/sessions/:id", chatController.getChatSessionById);
router.post("/sessions", chatController.createChatSession);
router.put("/sessions/:id", chatController.updateChatSession);
router.delete("/sessions/:id", chatController.deleteChatSession);

// Chat Messages
router.get("/messages", chatController.getAllChatMessages);
router.get("/messages/:id", chatController.getChatMessageById);
router.post("/messages", chatController.createChatMessage);
router.put("/messages/:id", chatController.updateChatMessage);
router.delete("/messages/:id", chatController.deleteChatMessage);

module.exports = router;
