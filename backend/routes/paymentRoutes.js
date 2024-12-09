const express = require("express");
const {
  createPayment,
  getPayments,
  pay,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create", createPayment);
router.get("/list", getPayments);
router.post("/pay", pay);

module.exports = router;
