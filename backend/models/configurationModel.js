const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Import konfigurasi database

const Configuration = sequelize.define(
  "Configuration",
  {
    config_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url_backend: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url_frontend: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    port: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "configurations",
    timestamps: false,
  }
);

module.exports = Configuration;
