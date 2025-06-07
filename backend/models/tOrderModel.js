// models/orderModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    order_code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    customer_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    // Kolom baru yang ditambahkan
    customer_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    customer_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location_latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    location_longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    device_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "t_orders",
    timestamps: false,
  }
);

module.exports = Order;
