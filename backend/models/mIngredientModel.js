const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Ingredient = sequelize.define(
  "Ingredient",
  {
    ingredient_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    ingredient_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: true, // Kolom unit dapat bernilai NULL
    },
    price_per_unit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: "m_ingredients", // Nama tabel sesuai dengan di database
    timestamps: true,
    createdAt: "created_at", // Sesuaikan nama kolom created_at
    updatedAt: "updated_at", // Sesuaikan nama kolom updated_at
  }
);

module.exports = Ingredient;
