// config/db.js
require("dotenv").config();
const { Sequelize } = require("sequelize");

// SET DATABASE PUBLIC
const dbUrl = process.env.DB_URL;
const { username, password, hostname, port, pathname } = new URL(dbUrl);

// Menghapus leading '/' pada pathname untuk mendapatkan nama database
const database = pathname.replace(/^\//, "");

console.log(
  `Username: ${username}, Password: ${password}, Host: ${hostname}, Port: ${port}, Database: ${database}`
);

const sequelize = new Sequelize(database, username, password, {
  host: hostname, // gunakan hostname langsung
  dialect: process.env.DB_DIALECT, // pastikan ini diset di .env
  port: Number(port), // Port harus berupa angka
  timezone: process.env.DB_TIMEZONE || "+07:00", // Default timezone jika tidak ada
  logging: console.log, // Opsional
});

// SET DATABASE LOCAL
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT,
//     timezone: process.env.DB_TIMEZONE,
//   }
// );

sequelize
  .authenticate()
  .then(() => console.log("Database terhubung..."))
  .catch((err) => console.error("Tidak dapat terhubung ke database : ", err));

module.exports = sequelize;
