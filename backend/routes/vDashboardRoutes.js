const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/vDashboardController");

// Dashboard summary routes
router.get("/summary", dashboardController.getDashboardSummary);
router.get("/top-products", dashboardController.getTopProducts);
router.get("/daily-trend", dashboardController.getDailySalesTrend);
router.get("/inventory-status", dashboardController.getInventoryStatus);
router.get("/customer-analysis", dashboardController.getCustomerAnalysis);
router.get("/monthly-comparison", dashboardController.getMonthlyComparison);
router.get("/product-performance", dashboardController.getProductPerformance);
router.get("/expense-breakdown", dashboardController.getExpenseBreakdown);
router.get("/sales-by-hour", dashboardController.getSalesByHour);
router.get("/low-stock-alerts", dashboardController.getLowStockAlerts);
router.get("/revenue-forecast", dashboardController.getRevenueForecast);

module.exports = router;
