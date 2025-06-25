const Order = require("../models/tOrderModel");
const OrderItem = require("../models/tOrderItemModel");
const tOrdersController = require("../controllers/tOrdersController");
const sequelize = require("../config/db");
const { Op } = require("sequelize");
const ChatSession = require("../models/chatSessionModel");
const ChatMessage = require("../models/chatMessageModel");
const User = require("../models/userModel");
const midtransClient = require("midtrans-client");
const crypto = require("crypto");

let payments = [];

// ENDPOINT 1: Buat token Midtrans saja (tanpa simpan ke database)
exports.createPaymentToken = async (req, res) => {
  const { customerInfo, paymentDetails, orderMetadata } = req.body;

  console.log("Creating payment token for:", customerInfo.order_code);

  // Validasi data yang sama seperti sebelumnya
  if (!paymentDetails) {
    return res.status(400).json({
      message: "Payment details are required!",
      success: false,
    });
  }

  if (
    !paymentDetails.price ||
    isNaN(paymentDetails.price) ||
    paymentDetails.price <= 0
  ) {
    return res.status(400).json({
      message: "Valid amount is required!",
      success: false,
    });
  }

  if (!customerInfo || !customerInfo.name || !customerInfo.name.trim()) {
    return res.status(400).json({
      message: "Customer name is required!",
      success: false,
    });
  }

  if (
    !customerInfo.phone ||
    !customerInfo.address ||
    !customerInfo.address.trim()
  ) {
    return res.status(400).json({
      message: "Phone number and address are required!",
      success: false,
    });
  }

  const phoneRegex = /^(\+62|62|0)[8][1-9][0-9]{6,9}$/;
  if (!phoneRegex.test(customerInfo.phone)) {
    return res.status(400).json({
      message: "Invalid Indonesian phone number format!",
      success: false,
    });
  }

  const { itemQuantity, itemPrice } = paymentDetails;

  if (
    !itemQuantity ||
    typeof itemQuantity !== "object" ||
    Object.keys(itemQuantity).length === 0
  ) {
    return res.status(400).json({
      message: "Item quantity data is required and cannot be empty.",
      success: false,
    });
  }

  if (
    !itemPrice ||
    typeof itemPrice !== "object" ||
    Object.keys(itemPrice).length === 0
  ) {
    return res.status(400).json({
      message: "Item price data is required and cannot be empty.",
      success: false,
    });
  }

  const quantityKeys = Object.keys(itemQuantity);
  const priceKeys = Object.keys(itemPrice);

  if (
    quantityKeys.length !== priceKeys.length ||
    !quantityKeys.every((key) => priceKeys.includes(key))
  ) {
    return res.status(400).json({
      message: "Key mismatch between itemQuantity and itemPrice.",
      success: false,
    });
  }

  for (const key of quantityKeys) {
    if (!itemQuantity[key] || itemQuantity[key] <= 0) {
      return res.status(400).json({
        message: `Invalid quantity for item ${key}`,
        success: false,
      });
    }
    if (!itemPrice[key] || itemPrice[key] <= 0) {
      return res.status(400).json({
        message: `Invalid price for item ${key}`,
        success: false,
      });
    }
  }

  const amount = Math.round(Number(paymentDetails.price));

  if (amount <= 0) {
    return res.status(400).json({
      message: "Invalid payment amount",
      success: false,
    });
  }

  // Inisialisasi Midtrans
  const serverKey =
    process.env.MIDTRANS_SERVER_KEY || "Mid-server-ilUB1AERQxRnybFBFjqNHf8Y";
  const clientKey =
    process.env.MIDTRANS_CLIENT_KEY || "Mid-client-DgVz86kwk0nSxw26";

  console.log("Using Midtrans Server Key:", serverKey.substring(0, 20) + "...");

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: serverKey,
    clientKey: clientKey,
  });

  const parameter = {
    transaction_details: {
      order_id: customerInfo.order_code,
      gross_amount: amount,
    },
    customer_details: {
      first_name: customerInfo.name.trim(),
      email: customerInfo.email?.trim() || `guest${Date.now()}@mailinator.com`,
      phone: customerInfo.phone.trim(),
      billing_address: {
        first_name: customerInfo.name.trim(),
        address: customerInfo.address.trim(),
        city: "Jakarta",
        postal_code: "12345",
        country_code: "IDN",
      },
    },
    enabled_payments: [
      "credit_card",
      "mandiri_clickpay",
      "cimb_clicks",
      "bca_klikbca",
      "bca_klikpay",
      "bri_epay",
      "echannel",
      "permata_va",
      "bca_va",
      "bni_va",
      "other_va",
      "gopay",
      "indomaret",
      "danamon_online",
      "akulaku",
    ],
    // Custom expiry untuk auto-cancel order yang tidak dibayar
    custom_expiry: {
      start_time: new Date().toISOString(),
      unit: "minute",
      duration: 60, // 60 menit untuk melakukan pembayaran
    },
  };

  try {
    console.log("Creating Midtrans transaction token...");
    console.log("Midtrans Parameter:", JSON.stringify(parameter, null, 2));

    const midtransTransaction = await snap.createTransaction(parameter);
    const snapToken = midtransTransaction.token;

    console.log("Midtrans token created successfully!");

    // Simpan sementara di memory untuk tracking (optional)
    payments[customerInfo.order_code] = {
      status: "token_created",
      created_at: new Date(),
      customer_info: customerInfo,
      payment_details: paymentDetails,
      snap_token: snapToken,
    };

    // Kembalikan hanya token, tanpa simpan ke database
    return res.status(200).json({
      message: "Payment token created successfully!",
      success: true,
      token: snapToken,
      order_code: customerInfo.order_code,
    });
  } catch (midtransError) {
    console.error("Gagal membuat token Midtrans:", midtransError);

    if (midtransError.ApiResponse) {
      console.error("Midtrans API Response:", midtransError.ApiResponse);
    }

    return res.status(500).json({
      message:
        "Payment gateway error. Please check your Midtrans configuration.",
      success: false,
      error: midtransError.message,
      details:
        process.env.NODE_ENV === "development"
          ? {
              httpStatusCode: midtransError.httpStatusCode,
              apiResponse: midtransError.ApiResponse,
            }
          : undefined,
    });
  }
};

// ENDPOINT 2: Simpan order ke database setelah user pilih pembayaran
exports.saveOrderToDatabase = async (req, res) => {
  const {
    customerInfo,
    paymentDetails,
    orderMetadata,
    paymentResult,
    paymentStatus,
  } = req.body;

  console.log(
    "Saving order to database:",
    customerInfo.order_code,
    "Status:",
    paymentStatus,
    "Payment Result:",
    paymentResult
  );

  // Validasi dasar
  if (!customerInfo || !customerInfo.order_code) {
    return res.status(400).json({
      message: "Order code is required!",
      success: false,
    });
  }

  if (!paymentResult) {
    return res.status(400).json({
      message: "Payment result is required!",
      success: false,
    });
  }

  // Tentukan status berdasarkan hasil pembayaran
  let orderStatus = "Menunggu"; // Default
  let paymentStatusDB = paymentStatus;
  let paymentTypeDB = null;
  let vaNumberDB = null;
  let snapTokenDB = null;

  // Extract payment information dari paymentResult
  if (paymentResult) {
    if (paymentResult.payment_type) {
      paymentTypeDB = paymentResult.payment_type;
    }

    if (paymentResult.va_numbers && paymentResult.va_numbers.length > 0) {
      vaNumberDB = paymentResult.va_numbers[0].va_number;
    } else if (paymentResult.permata_va_number) {
      vaNumberDB = paymentResult.permata_va_number;
    } else if (paymentResult.account_number) {
      vaNumberDB = paymentResult.account_number;
    }

    // Get snap token from memory storage
    if (
      payments[customerInfo.order_code] &&
      payments[customerInfo.order_code].snap_token
    ) {
      snapTokenDB = payments[customerInfo.order_code].snap_token;
    }
  }

  if (paymentStatus === "success") {
    orderStatus = "Sedang diproses";
    paymentStatusDB = "settlement";
  } else if (paymentStatus === "pending") {
    orderStatus = "Menunggu";
    paymentStatusDB = "pending";
  } else if (paymentStatus === "failed" || paymentStatus === "expired") {
    orderStatus = "Batal";
    paymentStatusDB = paymentStatus;
  }

  const transaction = await sequelize.transaction();

  try {
    // Cek apakah order sudah ada (untuk menghindari duplikasi)
    const existingOrder = await Order.findOne({
      where: { order_code: customerInfo.order_code },
    });

    if (existingOrder) {
      // Update status jika order sudah ada
      await existingOrder.update(
        {
          status: orderStatus,
          payment_status: paymentStatusDB,
          payment_type: paymentTypeDB,
          snap_token: snapTokenDB,
          va_number: vaNumberDB,
          payment_result: JSON.stringify(paymentResult),
          updated_at: new Date(),
        },
        { transaction }
      );

      await transaction.commit();

      // Update payment tracking
      if (payments[customerInfo.order_code]) {
        payments[customerInfo.order_code].status = orderStatus.toLowerCase();
        payments[customerInfo.order_code].payment_status = paymentStatusDB;
        payments[customerInfo.order_code].updated_at = new Date();
      }

      return res.status(200).json({
        message: "Order status updated successfully!",
        success: true,
        data: {
          orderCode: customerInfo.order_code,
          status: orderStatus,
          paymentStatus: paymentStatusDB,
          paymentType: paymentTypeDB,
          vaNumber: vaNumberDB,
          isUpdate: true,
        },
      });
    }

    // Buat order baru
    const newOrder = await Order.create(
      {
        order_code: customerInfo.order_code,
        customer_name: customerInfo.name.trim(),
        customer_phone: customerInfo.phone.trim(),
        customer_address: customerInfo.address.trim(),
        customer_email: customerInfo.email?.trim() || null,
        location_latitude: customerInfo.location?.latitude || null,
        location_longitude: customerInfo.location?.longitude || null,
        order_date: orderMetadata?.orderDate || new Date(),
        device_info: orderMetadata?.deviceInfo || null,
        status: orderStatus,
        payment_method: "midtrans",
        payment_status: paymentStatusDB,
        payment_type: paymentTypeDB,
        snap_token: snapTokenDB,
        va_number: vaNumberDB,
        payment_result: JSON.stringify(paymentResult),
        total_amount: paymentDetails.price || 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction }
    );

    const orderId = newOrder.order_id;

    // Buat order items
    const { itemQuantity, itemPrice } = paymentDetails;
    const quantityKeys = Object.keys(itemQuantity);

    const orderItems = quantityKeys.map((key) => ({
      order_id: orderId,
      product_id: parseInt(key),
      quantity: itemQuantity[key],
      price: itemPrice[key],
    }));

    await OrderItem.bulkCreate(orderItems, { transaction });

    // Cari admin untuk chat session
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
        order_code: customerInfo.order_code,
        created_by_device: orderMetadata?.deviceInfo || null,
        assigned_admin_id: admin?.id || null,
      },
      { transaction }
    );

    // Buat pesan otomatis berdasarkan status
    let autoMessage = "";
    if (orderStatus === "Sedang diproses") {
      autoMessage = `Terima kasih! Pembayaran untuk pesanan ${customerInfo.order_code} telah berhasil. Pesanan Anda sedang diproses.`;
    } else if (orderStatus === "Menunggu") {
      let paymentInfo = "";
      if (vaNumberDB && paymentTypeDB) {
        paymentInfo = ` Virtual Account: ${vaNumberDB} (${paymentTypeDB.toUpperCase()})`;
      }
      autoMessage = `Pesanan Anda dengan kode ${customerInfo.order_code} telah dibuat. Silakan selesaikan pembayaran untuk melanjutkan proses.${paymentInfo}`;
    } else if (orderStatus === "Batal") {
      autoMessage = `Pesanan ${customerInfo.order_code} dibatalkan karena pembayaran tidak berhasil atau expired.`;
    }

    await ChatMessage.create(
      {
        session_id: newSession.session_id,
        sender_type: "admin",
        sender_id: admin?.id,
        message: autoMessage,
        file_url: null,
        file_type: null,
        location_latitude: null,
        location_longitude: null,
      },
      { transaction }
    );

    // Commit transaksi database
    await transaction.commit();

    // Update payment tracking
    if (payments[customerInfo.order_code]) {
      payments[customerInfo.order_code].status = orderStatus.toLowerCase();
      payments[customerInfo.order_code].payment_status = paymentStatusDB;
      payments[customerInfo.order_code].saved_to_db = true;
      payments[customerInfo.order_code].saved_at = new Date();
    }

    // Notifikasi update order
    if (typeof tOrdersController?.notifyOrderUpdate === "function") {
      tOrdersController.notifyOrderUpdate();
    }

    console.log("Order saved successfully:", {
      orderCode: customerInfo.order_code,
      customerName: customerInfo.name,
      status: orderStatus,
      paymentStatus: paymentStatusDB,
      paymentType: paymentTypeDB,
      vaNumber: vaNumberDB,
      totalItems: orderItems.length,
    });

    return res.status(201).json({
      message: "Order saved successfully!",
      success: true,
      data: {
        orderDetails: {
          orderId: newOrder.order_id,
          orderCode: customerInfo.order_code,
          customerInfo: {
            name: customerInfo.name,
            phone: customerInfo.phone,
            address: customerInfo.address,
            email: customerInfo.email,
            hasLocation: !!customerInfo.location,
          },
          itemCount: orderItems.length,
          totalAmount: paymentDetails.price,
          status: orderStatus,
          paymentStatus: paymentStatusDB,
          paymentType: paymentTypeDB,
          vaNumber: vaNumberDB,
        },
      },
    });
  } catch (dbError) {
    await transaction.rollback();

    console.error("Database error when saving order:", dbError);

    let statusCode = 500;
    let errorMessage = "Failed to save order to database";

    if (dbError.name === "SequelizeValidationError") {
      statusCode = 400;
      errorMessage =
        "Validation error: " + dbError.errors.map((e) => e.message).join(", ");
    } else if (dbError.name === "SequelizeUniqueConstraintError") {
      statusCode = 409;
      errorMessage =
        "Duplicate entry: " + dbError.errors.map((e) => e.message).join(", ");
    }

    return res.status(statusCode).json({
      message: errorMessage,
      success: false,
      error: dbError.message,
      details:
        process.env.NODE_ENV === "development" ? dbError.stack : undefined,
    });
  }
};

// Endpoint untuk handle webhook dari Midtrans (PENTING untuk auto-update status)
exports.handleMidtransWebhook = async (req, res) => {
  try {
    const notification = req.body;

    console.log("=== MIDTRANS WEBHOOK RECEIVED ===");
    console.log("Notification:", JSON.stringify(notification, null, 2));

    // Verifikasi signature hash (untuk keamanan)
    const serverKey =
      process.env.MIDTRANS_SERVER_KEY || "Mid-server-ilUB1AERQxRnybFBFjqNHf8Y";
    const orderId = notification.order_id;
    const statusCode = notification.status_code;
    const grossAmount = notification.gross_amount;

    const signatureKey = crypto
      .createHash("sha512")
      .update(orderId + statusCode + grossAmount + serverKey)
      .digest("hex");

    if (signatureKey !== notification.signature_key) {
      console.log("❌ Invalid signature key");
      return res.status(403).json({ message: "Invalid signature key" });
    }

    console.log("✅ Signature verified");

    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const paymentType = notification.payment_type;

    console.log("Transaction details:", {
      orderId,
      transactionStatus,
      fraudStatus,
      paymentType,
    });

    // Extract VA number jika ada
    let vaNumber = null;
    if (notification.va_numbers && notification.va_numbers.length > 0) {
      vaNumber = notification.va_numbers[0].va_number;
    } else if (notification.permata_va_number) {
      vaNumber = notification.permata_va_number;
    } else if (notification.account_number) {
      vaNumber = notification.account_number;
    }

    // PERBAIKAN UTAMA: Cari order dengan lebih teliti
    console.log("🔍 Looking for order with code:", orderId);

    const order = await Order.findOne({
      where: {
        order_code: orderId,
      },
    });

    if (!order) {
      console.log("❌ Order not found with code:", orderId);

      // Coba cari berdasarkan snap_token jika ada
      if (notification.snap_token) {
        const orderByToken = await Order.findOne({
          where: { snap_token: notification.snap_token },
        });

        if (orderByToken) {
          console.log("✅ Order found by snap_token");
          return await updateOrderStatus(orderByToken, notification, res);
        }
      }

      return res.status(404).json({
        message: "Order not found",
        order_id: orderId,
      });
    }

    console.log("✅ Order found:", {
      order_id: order.order_id,
      order_code: order.order_code,
      current_status: order.status,
      current_payment_status: order.payment_status,
    });

    return await updateOrderStatus(order, notification, res);
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({
      message: "Webhook processing failed",
      error: error.message,
    });
  }
};

async function updateOrderStatus(order, notification, res) {
  const transaction = await sequelize.transaction();

  try {
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const paymentType = notification.payment_type;

    // Extract VA number
    let vaNumber = null;
    if (notification.va_numbers && notification.va_numbers.length > 0) {
      vaNumber = notification.va_numbers[0].va_number;
    } else if (notification.permata_va_number) {
      vaNumber = notification.permata_va_number;
    } else if (notification.account_number) {
      vaNumber = notification.account_number;
    }

    let newStatus = order.status;
    let newPaymentStatus = transactionStatus;

    // Tentukan status baru berdasarkan webhook
    if (transactionStatus === "capture") {
      if (fraudStatus === "challenge") {
        newStatus = "Menunggu"; // Butuh review manual
        newPaymentStatus = "challenge";
      } else if (fraudStatus === "accept") {
        newStatus = "Sedang diproses";
        newPaymentStatus = "settlement";
      }
    } else if (transactionStatus === "settlement") {
      newStatus = "Sedang diproses";
      newPaymentStatus = "settlement";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      newStatus = "Batal";
      newPaymentStatus = transactionStatus;
    } else if (transactionStatus === "pending") {
      newStatus = "Menunggu";
      newPaymentStatus = "pending";
    }

    console.log("Status update:", {
      from: `${order.status} (${order.payment_status})`,
      to: `${newStatus} (${newPaymentStatus})`,
    });

    // Update order dengan informasi lengkap
    await order.update(
      {
        status: newStatus,
        payment_status: newPaymentStatus,
        payment_type: paymentType,
        va_number: vaNumber,
        payment_result: JSON.stringify(notification),
        updated_at: new Date(),
      },
      { transaction }
    );

    console.log("✅ Order updated successfully");

    // Update payment tracking
    if (payments[order.order_code]) {
      payments[order.order_code].status = newStatus.toLowerCase();
      payments[order.order_code].payment_status = newPaymentStatus;
      payments[order.order_code].updated_at = new Date();
    }

    // Update chat message jika status berubah
    try {
      const chatSession = await ChatSession.findOne({
        where: { order_code: order.order_code },
      });

      if (chatSession) {
        let statusMessage = "";
        if (
          newStatus === "Sedang diproses" &&
          order.status !== "Sedang diproses"
        ) {
          statusMessage = `✅ Pembayaran untuk pesanan ${order.order_code} telah berhasil dikonfirmasi! Pesanan Anda sedang diproses.`;
        } else if (newStatus === "Batal" && order.status !== "Batal") {
          statusMessage = `❌ Pesanan ${order.order_code} dibatalkan karena pembayaran ${transactionStatus}.`;
        }

        if (statusMessage) {
          const admin = await User.findOne({
            where: { role: { [Op.iLike]: "admin" } },
          });

          await ChatMessage.create(
            {
              session_id: chatSession.session_id,
              sender_type: "admin",
              sender_id: admin?.id,
              message: statusMessage,
              file_url: null,
              file_type: null,
              location_latitude: null,
              location_longitude: null,
            },
            { transaction }
          );

          console.log("✅ Chat message updated");
        }
      }
    } catch (chatError) {
      console.error("⚠️ Error updating chat message:", chatError);
      // Jangan gagalkan transaksi karena chat error
    }

    await transaction.commit();

    // Notifikasi update order
    if (typeof tOrdersController?.notifyOrderUpdate === "function") {
      tOrdersController.notifyOrderUpdate();
    }

    console.log(
      `✅ Order ${order.order_code} status updated: ${order.status} → ${newStatus} (${newPaymentStatus})`
    );

    res.status(200).json({
      message: "Webhook processed successfully",
      order_code: order.order_code,
      status_change: {
        from: order.status,
        to: newStatus,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Error updating order status:", error);
    throw error;
  }
}

// Endpoint lama (deprecated - untuk backward compatibility)
exports.createPayment = async (req, res) => {
  return res.status(400).json({
    message:
      "This endpoint is deprecated. Use /create-token and /save-order instead.",
    success: false,
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

exports.checkOrderStatus = async (req, res) => {
  try {
    const { order_code } = req.params;

    const order = await Order.findOne({
      where: { order_code: order_code },
      include: [
        {
          model: OrderItem,
          as: "items", // Sesuaikan dengan association yang ada
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Order found",
      success: true,
      data: {
        order_id: order.order_id,
        order_code: order.order_code,
        status: order.status,
        payment_status: order.payment_status,
        payment_type: order.payment_type,
        va_number: order.va_number,
        snap_token: order.snap_token ? "EXISTS" : "NULL",
        created_at: order.created_at,
        updated_at: order.updated_at,
        payment_result: order.payment_result
          ? JSON.parse(order.payment_result)
          : null,
      },
    });
  } catch (error) {
    console.error("Error checking order status:", error);
    res.status(500).json({
      message: "Failed to check order status",
      success: false,
      error: error.message,
    });
  }
};
