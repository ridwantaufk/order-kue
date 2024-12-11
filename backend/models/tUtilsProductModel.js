const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Model untuk t_utils_product
const ProductUtils = sequelize.define(
  "t_utils_product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "m_products",
        key: "product_id",
      },
      onDelete: "CASCADE",
    },
    favorite: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "t_utils_product",
    timestamps: false,
  }
);

// Ekspor model
module.exports = ProductUtils;
