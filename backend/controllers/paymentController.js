const { generateVA, generateOrderID } = require("../utils/generateVA");

let payments = []; // Menyimpan data pembayaran sementara

exports.createPayment = (req, res) => {
  const { amount, customerName } = req.body;

  if (!amount || !customerName) {
    return res
      .status(400)
      .json({ message: "Amount and Customer Name are required!" });
  }

  const vaNumber = generateVA();
  const orderID = generateOrderID();
  const newPayment = {
    orderID,
    vaNumber,
    customerName,
    amount,
    status: "PENDING",
  };

  payments.push(newPayment);

  return res.status(201).json({
    message: "Virtual Account created successfully!",
    data: newPayment,
  });
};

exports.getPayments = (req, res) => {
  res.status(200).json(payments);
};

exports.pay = (req, res) => {
  const { vaNumber } = req.body;

  const payment = payments.find((p) => p.vaNumber === vaNumber);
  if (!payment) {
    return res.status(404).json({ message: "Payment not found!" });
  }

  payment.status = "PAID";

  return res.status(200).json({
    message: "Payment successful!",
    data: payment,
  });
};
