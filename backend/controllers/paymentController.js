const Order = require("../models/tOrderModel");
const OrderItem = require("../models/tOrderItemModel");
const tOrdersController = require("../controllers/tOrdersController");
const { generateVA, generateOrderID } = require("../utils/generateVA");
const sequelize = require("../config/db");

let payments = []; // Menyimpan data pembayaran sementara

exports.createPayment = async (req, res) => {
  const { customerName, paymentDetails } = req.body;
  const amount = paymentDetails.price;

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

  // Mulai transaksi
  const transaction = await sequelize.transaction();

  try {
    const newOrder = await Order.create(
      {
        order_code: orderID,
        customer_name: customerName,
      },
      { transaction }
    );

    const orderId = newOrder.order_id;

    const { itemQuantity, itemPrice } = paymentDetails;

    const quantityKeys = Object.keys(itemQuantity);
    const priceKeys = Object.keys(itemPrice);

    if (
      quantityKeys.length !== priceKeys.length ||
      !quantityKeys.every((key) => priceKeys.includes(key))
    ) {
      throw new Error("Key mismatch between itemQuantity and itemPrice.");
    }

    const orderItems = quantityKeys.map((key) => ({
      order_id: orderId,
      product_id: parseInt(key), // Key dari itemQuantity dan itemPrice
      quantity: itemQuantity[key],
      price: itemPrice[key],
    }));

    await OrderItem.bulkCreate(orderItems, { transaction });

    await transaction.commit();

    tOrdersController.notifyOrderUpdate();

    // Kembalikan respons sukses dengan data newOrder dan newPayment
    return res.status(201).json({
      message: "Virtual Account and Order created successfully!",
      data: newPayment,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in createPayment:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
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
