// File: models/vExpenses.js
const { DataTypes } = require("sequelize");
const db = require("../config/db"); // Sesuaikan path jika berbeda

const vExpenses = db.define(
  "vExpenses",
  {
    created_date: {
      type: DataTypes.DATEONLY,
      primaryKey: true,
      allowNull: false,
    },
    total_ingredients_cost: {
      type: DataTypes.NUMERIC,
      allowNull: true,
    },
    total_operational_cost: {
      type: DataTypes.NUMERIC,
      allowNull: true,
    },
    total_sales: {
      type: DataTypes.NUMERIC,
      allowNull: true,
    },
  },
  {
    tableName: "v_expenses", // Nama view di database
    timestamps: false, // Karena ini adalah view
  }
);

module.exports = vExpenses;
