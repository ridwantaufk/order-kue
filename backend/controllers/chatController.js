const ChatSession = require("../models/chatSessionModel");
const ChatMessage = require("../models/chatMessageModel");
const Order = require("../models/tOrderModel");
const { Op } = require("sequelize");
const User = require("../models/userModel");

// =================== CHAT SESSION ===================

// Get all chat sessions for an admin
const getAllChatSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.findAll({
      include: [
        {
          model: ChatMessage,
          as: "ChatMessages",
          order: [["created_at", "DESC"]],
          limit: 1,
        },
        {
          model: Order,
          as: "Order",
          attributes: ["customer_name", "customer_phone"],
        },
      ],
      order: [["updated_at", "DESC"]],
    });

    const sessionsWithUnread = await Promise.all(
      sessions.map(async (session) => {
        const unreadCount = await ChatMessage.count({
          where: {
            session_id: session.session_id,
            sender_type: "buyer",
            read_at: null,
          },
        });
        return {
          ...session.toJSON(),
          unread_count: unreadCount,
          last_message: session.ChatMessages[0] || null,
        };
      })
    );

    res.json(sessionsWithUnread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get chat sessions by customer phone
const getChatSessionsByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const orders = await Order.findAll({
      where: { customer_phone: phone },
      attributes: ["order_code"],
    });

    if (orders.length === 0) {
      return res.json([]);
    }

    const orderCodes = orders.map((order) => order.order_code);

    const sessions = await ChatSession.findAll({
      where: { order_code: { [Op.in]: orderCodes } },
      include: [
        {
          model: ChatMessage,
          as: "ChatMessages",
          order: [["created_at", "DESC"]],
          limit: 1,
        },
      ],
      order: [["updated_at", "DESC"]],
    });

    const sessionsWithUnread = await Promise.all(
      sessions.map(async (session) => {
        const unreadCount = await ChatMessage.count({
          where: {
            session_id: session.session_id,
            sender_type: "admin",
            read_at: null,
          },
        });
        const admin = await User.findOne({
          where: { role: "admin" },
          attributes: ["is_online"],
        });
        return {
          ...session.toJSON(),
          unread_count: unreadCount,
          last_message: session.ChatMessages[0] || null,
          admin_online: admin ? admin.is_online : false,
        };
      })
    );

    res.json(sessionsWithUnread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single chat session by order_code, including all messages
const getChatSessionByOrderCode = async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      where: { order_code: req.params.order_code },
      include: {
        model: ChatMessage,
        as: "ChatMessages",
        order: [["created_at", "ASC"]],
      },
    });

    if (!session)
      return res.status(404).json({ message: "Chat session not found" });

    // Mark messages as read by the buyer
    await ChatMessage.update(
      { read_at: new Date() },
      {
        where: {
          session_id: session.session_id,
          sender_type: "admin",
          read_at: null,
        },
      }
    );

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =================== CHAT MESSAGE ===================

// Create new chat message
const createChatMessage = async (req, res) => {
  try {
    const { session_id, sender_type, sender_id, message, file_url, file_type } =
      req.body;

    // 1. Create the message
    const newMessage = await ChatMessage.create({
      session_id,
      sender_type,
      sender_id,
      message,
      file_url,
      file_type,
    });

    // 2. Update the session's updated_at timestamp
    const session = await ChatSession.findByPk(session_id);
    if (session) {
      session.updated_at = new Date();
      await session.save();
    } else {
      return res.status(404).json({ message: "Session not found" });
    }

    // 3. Emit the message via socket
    const io = req.app.get("socketio");
    const { getSocketIds } = require("../utils/socketManager");

    // Notify admins
    const adminSocketIds = getSocketIds("admin");
    adminSocketIds.forEach((socketId) => {
      io.to(socketId).emit("new_message", newMessage);
    });

    // Notify the specific buyer
    const buyerSocketIds = getSocketIds("buyer", session.order_code);
    buyerSocketIds.forEach((socketId) => {
      io.to(socketId).emit("new_message", newMessage);
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const { session_id } = req.params;
    const { user_type } = req.body; // 'admin' or 'buyer'

    const senderTypeToUpdate = user_type === "admin" ? "buyer" : "admin";

    await ChatMessage.update(
      { read_at: new Date() },
      {
        where: {
          session_id,
          sender_type: senderTypeToUpdate,
          read_at: null,
        },
      }
    );

    // Notify clients that messages have been read
    const io = req.app.get("socketio");
    const { getSocketIds } = require("../utils/socketManager");

    const session = await ChatSession.findByPk(session_id);
    if (session) {
      const targetSocketIds = getSocketIds(
        user_type,
        user_type === "buyer" ? session.order_code : null
      );
      targetSocketIds.forEach((socketId) => {
        io.to(socketId).emit("messages_marked_read", { session_id });
      });
    }

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllChatSessions,
  getChatSessionsByPhone,
  getChatSessionByOrderCode,
  createChatMessage,
  markMessagesAsRead,
};
