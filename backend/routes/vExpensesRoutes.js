const express = require("express");
const router = express.Router();
const expensesController = require("../controllers/vExpensesController");

router.get("/", expensesController.getExpenses);
router.get(
  "/dashboard-information-summary",
  expensesController.getMonthlyExpensesSummary
);

module.exports = router;
