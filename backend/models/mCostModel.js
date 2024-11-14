const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cost = sequelize.define(
  "Cost",
  {
    cost_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    cost_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cost_description: {
      type: DataTypes.TEXT,
      allowNull: true, // Sesuai dengan definisi tabel
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cost_date: {
      type: DataTypes.DATEONLY,
      allowNull: true, // Sesuai dengan definisi tabel
    },
    created_at: {
      type: DataTypes.DATE(0), // Menghilangkan milidetik
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE(0), // Menghilangkan milidetik
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: "m_costs",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);

module.exports = Cost;
