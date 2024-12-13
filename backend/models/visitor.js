const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Visitor = sequelize.define(
  "Visitor",
  {
    ip_address: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    page_visited: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    visit_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
    latitude_gps: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    longitude_gps: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    location_details_gps: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    tableName: "visitors",
    timestamps: false,
  }
);

module.exports = Visitor;
