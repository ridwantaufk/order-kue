const ChatSession = require("../models/chatSessionModel");
const ChatMessage = require("../models/chatMessageModel");

// =================== CHAT SESSION ===================

// Get all chat sessions
const getAllChatSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.findAll({
      include: { model: ChatMessage },
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single chat session by ID
const getChatSessionById = async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      where: { order_code: req.params.id },
      include: { model: ChatMessage },
    });

    if (!session)
      return res.status(404).json({ message: "Chat session not found" });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new chat session
const createChatSession = async (req, res) => {
  try {
    const session = await ChatSession.create(req.body);
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update chat session
const updateChatSession = async (req, res) => {
  try {
    const [updated] = await ChatSession.update(req.body, {
      where: { session_id: req.params.id },
    });
    if (!updated) return res.status(404).json({ message: "Session not found" });
    res.json({ message: "Session updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete chat session
const deleteChatSession = async (req, res) => {
  try {
    const deleted = await ChatSession.destroy({
      where: { session_id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ message: "Session not found" });
    res.json({ message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =================== CHAT MESSAGE ===================

// Get all chat messages
const getAllChatMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.findAll();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get chat message by ID
const getChatMessageById = async (req, res) => {
  try {
    const message = await ChatMessage.findByPk(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new chat message
const createChatMessage = async (req, res) => {
  try {
    const message = await ChatMessage.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update chat message
const updateChatMessage = async (req, res) => {
  try {
    const [updated] = await ChatMessage.update(req.body, {
      where: { message_id: req.params.id },
    });
    if (!updated) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete chat message
const deleteChatMessage = async (req, res) => {
  try {
    const deleted = await ChatMessage.destroy({
      where: { message_id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // ChatSession
  getAllChatSessions,
  getChatSessionById,
  createChatSession,
  updateChatSession,
  deleteChatSession,

  // ChatMessage
  getAllChatMessages,
  getChatMessageById,
  createChatMessage,
  updateChatMessage,
  deleteChatMessage,
};
