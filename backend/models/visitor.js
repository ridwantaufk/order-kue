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
    },
    region: {
      type: DataTypes.STRING(50),
    },
    city: {
      type: DataTypes.STRING(50),
    },
    page_visited: {
      type: DataTypes.STRING(255),
    },
    visit_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    user_agent: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "visitors",
    timestamps: false,
  }
);

module.exports = Visitor;
