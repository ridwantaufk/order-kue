const Order = require("../models/tOrderModel");
const OrderItem = require("../models/tOrderItemModel");
const tOrdersController = require("../controllers/tOrdersController");
const { generateVA, generateOrderID } = require("../utils/generateVA");
const sequelize = require("../config/db");
const { Op } = require("sequelize");
const ChatSession = require("../models/chatSessionModel");
const ChatMessage = require("../models/chatMessageModel");
const User = require("../models/userModel");

let payments = []; // Menyimpan data pembayaran sementara

exports.createPayment = async (req, res) => {
  // Destructure data yang dikirim dari frontend
  const { customerInfo, paymentDetails, orderMetadata } = req.body;

  console.log("Detail Order Pelanggan : ", req.body);

  // Validasi data yang diperlukan
  if (!paymentDetails?.price || !customerInfo?.name) {
    return res
      .status(400)
      .json({ message: "Amount and Customer Name are required!" });
  }

  // Validasi tambahan untuk data customer
  if (!customerInfo.phone || !customerInfo.address) {
    return res
      .status(400)
      .json({ message: "Phone number and address are required!" });
  }

  // Validasi format nomor telepon Indonesia
  const phoneRegex = /^(\+62|62|0)[8][1-9][0-9]{6,9}$/;
  if (!phoneRegex.test(customerInfo.phone)) {
    return res
      .status(400)
      .json({ message: "Invalid Indonesian phone number format!" });
  }

  const amount = paymentDetails.price;
  const vaNumber = generateVA();
  const orderID = generateOrderID();

  const newPayment = {
    orderID,
    vaNumber,
    customerName: customerInfo.name,
    amount,
    status: "PENDING",
  };

  payments.push(newPayment);

  // Mulai transaksi
  const transaction = await sequelize.transaction();

  try {
    // Buat order dengan data lengkap
    const newOrder = await Order.create(
      {
        order_code: orderID,
        customer_name: customerInfo.name.trim(),
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address.trim(),
        // Simpan koordinat jika ada
        location_latitude: customerInfo.location?.latitude || null,
        location_longitude: customerInfo.location?.longitude || null,
        // Metadata tambahan
        order_date: orderMetadata?.orderDate || new Date(),
        device_info: orderMetadata?.deviceInfo || null,
        status: "Menunggu",
      },
      { transaction }
    );

    const orderId = newOrder.order_id;
    const { itemQuantity, itemPrice } = paymentDetails;

    // Validasi itemQuantity dan itemPrice
    if (!itemQuantity || !itemPrice) {
      throw new Error("Item quantity and price data are required.");
    }

    const quantityKeys = Object.keys(itemQuantity);
    const priceKeys = Object.keys(itemPrice);

    if (
      quantityKeys.length !== priceKeys.length ||
      !quantityKeys.every((key) => priceKeys.includes(key))
    ) {
      throw new Error("Key mismatch between itemQuantity and itemPrice.");
    }

    // Validasi bahwa ada minimal 1 item
    if (quantityKeys.length === 0) {
      throw new Error("At least one item must be ordered.");
    }

    const orderItems = quantityKeys.map((key) => ({
      order_id: orderId,
      product_id: parseInt(key),
      quantity: itemQuantity[key],
      price: itemPrice[key],
    }));

    await OrderItem.bulkCreate(orderItems, { transaction });

    const admin = await User.findOne({
      where: {
        role: {
          [Op.iLike]: "admin",
        },
      },
    });

    // Buat sesi chat
    const newSession = await ChatSession.create(
      {
        order_id: newOrder.order_id,
        order_code: orderID,
        created_by_device: orderMetadata?.deviceInfo || null,
        assigned_admin_id: admin?.id || null,
      },
      { transaction }
    );

    // Buat pesan otomatis dari admin (penjual)
    await ChatMessage.create(
      {
        session_id: newSession.session_id,
        sender_type: "admin",
        sender_id: admin?.id, // fallback id 1 kalau nggak ada admin ditemukan
        message: `Pesanan Anda dengan kode ${orderID} sedang diproses. Silakan lakukan pembayaran untuk melanjutkan.`,
        file_url: null,
        file_type: null,
        location_latitude: null,
        location_longitude: null,
      },
      { transaction }
    );

    // Commit transaksi
    await transaction.commit();

    // Inisialisasi Snap
    const midtransClient = require("midtrans-client");
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    // Buat Snap Token Midtrans
    const snapParams = {
      transaction_details: {
        order_id: orderID,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customerInfo.name,
        email: `guest${Date.now()}@mailinator.com`, // fallback email
        phone: customerInfo.phone,
        billing_address: {
          address: customerInfo.address,
        },
      },
    };

    let snapToken;
    try {
      const transaction = await snap.createTransaction(snapParams);
      snapToken = transaction.token;
    } catch (snapErr) {
      console.error("Gagal generate token Midtrans:", snapErr.message);
      // Di sini bisa kirim token kosong atau tetap lanjut
    }

    // Notifikasi update order
    if (typeof tOrdersController?.notifyOrderUpdate === "function") {
      tOrdersController.notifyOrderUpdate();
    }

    // Log untuk debugging
    console.log("Order created successfully:", {
      orderID,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      hasLocation: !!customerInfo.location,
      totalItems: orderItems.length,
    });

    // Kembalikan respons sukses dengan data lengkap
    return res.status(201).json({
      message: "Virtual Account and Order created successfully!",
      data: {
        ...newPayment,
        orderDetails: {
          orderId: newOrder.order_id,
          orderCode: orderID,
          customerInfo: {
            name: customerInfo.name,
            phone: customerInfo.phone,
            address: customerInfo.address,
            hasLocation: !!customerInfo.location,
          },
          itemCount: orderItems.length,
          totalAmount: amount,
        },
      },
    });
  } catch (error) {
    // Rollback transaksi jika terjadi error
    await transaction.rollback();

    console.error("Error in createPayment:", error.message);

    // Handle different types of errors
    let statusCode = 500;
    let errorMessage = "Failed to create order";

    if (
      error.message.includes("mismatch") ||
      error.message.includes("required") ||
      error.message.includes("At least one item")
    ) {
      statusCode = 400;
      errorMessage = error.message;
    } else if (error.name === "SequelizeValidationError") {
      statusCode = 400;
      errorMessage =
        "Validation error: " + error.errors.map((e) => e.message).join(", ");
    } else if (error.name === "SequelizeUniqueConstraintError") {
      statusCode = 409;
      errorMessage =
        "Duplicate entry: " + error.errors.map((e) => e.message).join(", ");
    }

    return res.status(statusCode).json({
      message: errorMessage,
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
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
