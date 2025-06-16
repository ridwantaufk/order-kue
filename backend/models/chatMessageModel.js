const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const ChatSession = require("./chatSessionModel");

const ChatMessage = sequelize.define(
  "ChatMessage",
  {
    message_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal("gen_random_uuid()"),
      allowNull: false,
    },
    session_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sender_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [["buyer", "admin"]],
      },
    },
    sender_id: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    file_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    file_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    location_latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    location_longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
  },
  {
    tableName: "chat_messages",
    timestamps: false,
  }
);

// Relasi
ChatMessage.belongsTo(ChatSession, {
  foreignKey: "session_id",
  targetKey: "session_id",
});

ChatSession.hasMany(ChatMessage, {
  foreignKey: "session_id",
  sourceKey: "session_id",
});

module.exports = ChatMessage;
