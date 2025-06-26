// PERBAIKAN 6: Update routes/paymentRoutes.js
// Ganti seluruh file dengan ini:

const express = require("express");
const {
  createPayment,
  getPayments,
  pay,
  saveOrderToDatabase,
  handleMidtransWebhook,
  createPaymentToken,
  checkOrderStatus, // Tambahan untuk debugging
} = require("../controllers/paymentController");

const router = express.Router();

// Existing routes
router.post("/create", createPayment);
router.post("/create-token", createPaymentToken);
router.post("/save-order", saveOrderToDatabase);
router.post("/webhook", handleMidtransWebhook);
router.get("/list", getPayments);
router.post("/pay", pay);

// New debug route
router.get("/status/:order_code", checkOrderStatus);

module.exports = router;
