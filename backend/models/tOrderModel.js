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
      unique: true, // Tambahkan unique constraint
    },
    customer_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    customer_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    customer_email: {
      type: DataTypes.STRING,
      allowNull: true,
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
    payment_method: {
      type: DataTypes.STRING,
      defaultValue: "midtrans",
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    snap_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    va_number: {
      type: DataTypes.STRING,
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
    // FIELD BARU:
    payment_result: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: "t_orders",
    timestamps: false,
    // Tambahkan index untuk performa
    indexes: [
      {
        fields: ["order_code"],
      },
      {
        fields: ["payment_status"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["snap_token"],
      },
    ],
  }
);

module.exports = Order;
