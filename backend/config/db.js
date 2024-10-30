// config/db.js
const { Sequelize } = require("sequelize");

// Sesuaikan pengaturan database
const sequelize = new Sequelize("db_nodejs", "postgres", "root", {
  host: "localhost",
  dialect: "postgres", // atau mysql sesuai database yang digunakan
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Unable to connect to the database:", err));

module.exports = sequelize;
