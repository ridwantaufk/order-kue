const express = require("express");
const {
  // createPayment,
  initiatePayment,
  handleMidtransWebhook,
} = require("../controllers/paymentController");

const router = express.Router();

// router.post("/create", createPayment);
router.post("/initiate", initiatePayment);
router.post("/webhook", handleMidtransWebhook);

module.exports = router;
