// models/TotalExpensesView.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Pastikan mengimpor konfigurasi database

const TotalExpensesView = sequelize.define(
  "TotalExpensesView",
  {
    total_ingredients_cost: {
      type: DataTypes.DECIMAL(10, 2),
    },
    total_operational_cost: {
      type: DataTypes.DECIMAL(10, 2),
    },
    grand_total: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    tableName: "v_total_expenses",
    timestamps: false, // Karena view biasanya tidak memiliki timestamps
  }
);

module.exports = TotalExpensesView;
