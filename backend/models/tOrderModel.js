// models/tOrderModel.js
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
      unique: true,
    },
    customer_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    customer_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    customer_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    customer_email: {
      type: DataTypes.STRING(100),
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
    payment_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "e.g: bank_transfer, qris, gopay, shopeepay, etc",
    },
    va_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Virtual Account number or payment reference",
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
    timestamps: false, // Since we're handling timestamps manually
    indexes: [
      {
        unique: true,
        fields: ["order_code"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["order_date"],
      },
    ],
  }
);

// Add hooks for updated_at
Order.addHook("beforeUpdate", (order) => {
  order.updated_at = new Date();
});

module.exports = Order;
