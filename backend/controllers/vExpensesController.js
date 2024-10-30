const { Sequelize, Op } = require("sequelize");
const db = require("../config/db");
const vExpenses = require("../models/vExpenses");

// Fungsi untuk mengambil semua data pengeluaran
exports.getExpenses = async (req, res) => {
  try {
    const expensesData = await vExpenses.findAll();
    res.json(expensesData);
  } catch (error) {
    console.error("Error fetching all expenses:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
};

// Fungsi untuk mengambil ringkasan pengeluaran dan penjualan bulanan
exports.getMonthlyExpensesSummary = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1; // Bulan saat ini (1-12)
    const currentYear = new Date().getFullYear(); // Tahun saat ini

    const expensesSummary = await vExpenses.findAll({
      attributes: [
        [
          Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("created_date")),
          "month",
        ],
        [Sequelize.fn("SUM", Sequelize.col("total_sales")), "total_sales"],
        [
          Sequelize.fn("SUM", Sequelize.col("total_ingredients_cost")),
          "total_ingredients_cost",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("total_operational_cost")),
          "total_operational_cost",
        ],
      ],
      where: {
        created_date: {
          [Op.gte]: new Date(currentYear, currentMonth - 1, 1), // Tanggal awal bulan ini
          [Op.lt]: new Date(currentYear, currentMonth, 1), // Tanggal awal bulan depan
        },
      },
      group: [
        Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("created_date")),
      ], // Mengelompokkan berdasarkan bulan
    });

    res.json(expensesSummary);
  } catch (error) {
    console.error("Error fetching current month expenses summary:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
};

// Fungsi untuk mendapatkan ringkasan pengeluaran bulanan menggunakan query mentah
// exports.getMonthlyExpensesSummary = async (req, res) => {
//   try {
//     const [results, metadata] = await vExpenses.sequelize.query(`
//     select * from v_expenses
//     `);

//     // Mengirimkan hasil ke client
//     return res.status(200).json({
//       success: true,
//       data: results,
//     });
//   } catch (error) {
//     console.error("Error fetching current month expenses summary:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// Tambahkan fungsi lain sesuai kebutuhan
