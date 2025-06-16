const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ChatSession = sequelize.define(
  "ChatSession",
  {
    session_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal("gen_random_uuid()"),
      allowNull: false,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_code: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    created_by_device: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    assigned_admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "chat_sessions",
    timestamps: false,
  }
);

module.exports = ChatSession;
