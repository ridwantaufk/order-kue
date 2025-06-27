const Order = require("../models/tOrderModel");
const OrderItem = require("../models/tOrderItemModel");
const tOrdersController = require("../controllers/tOrdersController");
const sequelize = require("../config/db");
const { Op } = require("sequelize");
const ChatSession = require("../models/chatSessionModel");
const ChatMessage = require("../models/chatMessageModel");
const User = require("../models/userModel");
const midtransClient = require("midtrans-client");

// Store temporary order data in memory
const tempOrderData = new Map();

exports.initiatePayment = async (req, res) => {
  const { customerInfo, paymentDetails, orderMetadata } = req.body;

  // Validasi basic
  if (!customerInfo || !paymentDetails?.price) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  // Validasi data customer
  if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
    return res.status(400).json({
      message: "Customer name, phone, and address are required",
    });
  }

  // Validasi format nomor telepon Indonesia
  const phoneRegex = /^(\+62|62|0)[8][1-9][0-9]{6,9}$/;
  if (!phoneRegex.test(customerInfo.phone)) {
    return res.status(400).json({
      message: "Invalid Indonesian phone number format",
    });
  }

  // Validasi email jika ada
  if (customerInfo.customer_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.customer_email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
  }

  // Validasi item data
  const { itemQuantity, itemPrice } = paymentDetails;
  if (!itemQuantity || !itemPrice) {
    return res.status(400).json({
      message: "Item quantity and price data are required",
    });
  }

  const quantityKeys = Object.keys(itemQuantity);
  const priceKeys = Object.keys(itemPrice);

  if (quantityKeys.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one item must be ordered" });
  }

  if (
    quantityKeys.length !== priceKeys.length ||
    !quantityKeys.every((key) => priceKeys.includes(key))
  ) {
    return res.status(400).json({
      message: "Mismatch between item quantity and price data",
    });
  }

  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: customerInfo.order_code,
        gross_amount: paymentDetails.price,
      },
      customer_details: {
        first_name: customerInfo.name.trim(),
        email: customerInfo.customer_email || "noreply@example.com",
        phone: customerInfo.phone.trim(),
      },
      // Enable all payment methods
      enabled_payments: [
        "credit_card",
        "bca_va",
        "bni_va",
        "bri_va",
        "echannel",
        "permata_va",
        "other_va",
        "gopay",
        "shopeepay",
        "qris",
      ],
    };

    // Store order data temporarily with order_code as key
    tempOrderData.set(customerInfo.order_code, {
      customerInfo: {
        ...customerInfo,
        name: customerInfo.name.trim(),
        phone: customerInfo.phone.trim(),
        address: customerInfo.address.trim(),
      },
      paymentDetails,
      orderMetadata: {
        orderDate: orderMetadata?.orderDate || new Date(),
        deviceInfo: orderMetadata?.deviceInfo || null,
      },
    });

    // Set timeout to clear temp data after 24 hours
    setTimeout(() => {
      tempOrderData.delete(customerInfo.order_code);
    }, 24 * 60 * 60 * 1000);

    const snapResponse = await snap.createTransaction(parameter);

    console.log(`Payment initiated for order: ${customerInfo.order_code}`);

    return res.json({
      snapToken: snapResponse.token,
      orderId: customerInfo.order_code,
      redirectUrl: snapResponse.redirect_url,
    });
  } catch (error) {
    console.error("Midtrans error:", error);
    tempOrderData.delete(customerInfo.order_code);

    return res.status(500).json({
      message: "Failed to initiate payment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.handleMidtransWebhook = async (req, res) => {
  const notification = req.body;
  const orderCode = notification.order_id;
  const transactionStatus = notification.transaction_status;
  const paymentType = notification.payment_type;
  const vaNumber =
    notification.va_numbers?.[0]?.va_number || notification.bill_key;
  const fraudStatus = notification.fraud_status;

  console.log(
    `Webhook received for order: ${orderCode}, status: ${transactionStatus}`
  );

  // Determine order status based on transaction status
  let newStatus = "Menunggu";
  if (
    transactionStatus === "settlement" ||
    (transactionStatus === "capture" && fraudStatus === "accept")
  ) {
    newStatus = "Sedang diproses";
  } else if (["cancel", "expire", "failure"].includes(transactionStatus)) {
    newStatus = "Batal";
  } else if (transactionStatus === "pending") {
    newStatus = "Menunggu";
  }

  const transaction = await sequelize.transaction();

  try {
    // Check if order already exists
    const existingOrder = await Order.findOne({
      where: { order_code: orderCode },
    });

    if (!existingOrder) {
      // Get temp data for new order
      const tempData = tempOrderData.get(orderCode);

      if (!tempData) {
        console.error(`No temp data found for order: ${orderCode}`);
        await transaction.rollback();
        return res.status(404).json({ message: "Order data not found" });
      }

      // Create new order
      const newOrder = await Order.create(
        {
          order_code: orderCode,
          customer_name: tempData.customerInfo.name,
          customer_phone: tempData.customerInfo.phone,
          customer_address: tempData.customerInfo.address,
          location_latitude: tempData.customerInfo.location?.latitude || null,
          location_longitude: tempData.customerInfo.location?.longitude || null,
          order_date: tempData.orderMetadata.orderDate,
          device_info: tempData.orderMetadata.deviceInfo,
          status: newStatus,
          email: tempData.customerInfo.customer_email || null,
          payment_type: paymentType,
          va_number: vaNumber || null,
        },
        { transaction }
      );

      // Create order items
      const itemKeys = Object.keys(tempData.paymentDetails.itemQuantity);
      const orderItems = itemKeys.map((key) => ({
        order_id: newOrder.order_id,
        product_id: parseInt(key),
        quantity: tempData.paymentDetails.itemQuantity[key],
        price: tempData.paymentDetails.itemPrice[key],
      }));

      await OrderItem.bulkCreate(orderItems, { transaction });

      // Find admin for chat
      const admin = await User.findOne({
        where: { role: { [Op.iLike]: "admin" } },
      });

      // Create chat session
      const newSession = await ChatSession.create(
        {
          order_id: newOrder.order_id,
          order_code: newOrder.order_code,
          created_by_device: tempData.orderMetadata.deviceInfo,
          assigned_admin_id: admin?.id || null,
        },
        { transaction }
      );

      // Create initial chat message
      const initialMessage =
        newStatus === "Sedang diproses"
          ? `Terima kasih! Pembayaran untuk pesanan ${orderCode} telah diterima dan sedang diproses.`
          : `Pesanan ${orderCode} telah dibuat. Silakan lakukan pembayaran untuk melanjutkan.`;

      await ChatMessage.create(
        {
          session_id: newSession.session_id,
          sender_type: "admin",
          sender_id: admin?.id || null,
          message: initialMessage,
          file_url: null,
          file_type: null,
          location_latitude: null,
          location_longitude: null,
        },
        { transaction }
      );

      // Clear temp data after successful order creation
      tempOrderData.delete(orderCode);

      console.log(
        `Order ${orderCode} created successfully with status: ${newStatus}`
      );
    } else {
      // Update existing order status
      await Order.update(
        {
          status: newStatus,
          payment_type: paymentType,
          va_number: vaNumber || existingOrder.va_number,
          updated_at: new Date(),
        },
        { where: { order_code: orderCode }, transaction }
      );

      // Add chat message for status update if significant change
      if (
        newStatus === "Sedang diproses" &&
        existingOrder.status !== "Sedang diproses"
      ) {
        const chatSession = await ChatSession.findOne({
          where: { order_code: orderCode },
        });

        if (chatSession) {
          const admin = await User.findOne({
            where: { role: { [Op.iLike]: "admin" } },
          });

          await ChatMessage.create(
            {
              session_id: chatSession.session_id,
              sender_type: "admin",
              sender_id: admin?.id || null,
              message: `Pembayaran telah diterima! Pesanan ${orderCode} sedang diproses.`,
              file_url: null,
              file_type: null,
              location_latitude: null,
              location_longitude: null,
            },
            { transaction }
          );
        }
      }

      console.log(`Order ${orderCode} updated to status: ${newStatus}`);
    }

    await transaction.commit();

    // Notify order update for real-time updates
    if (typeof tOrdersController?.notifyOrderUpdate === "function") {
      tOrdersController.notifyOrderUpdate();
    }

    return res.status(200).json({
      message: "Webhook processed successfully",
      orderCode,
      status: newStatus,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Webhook processing error:", error);

    return res.status(500).json({
      message: "Webhook processing failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Helper function to clean up expired temp data (optional)
exports.cleanupTempData = () => {
  const now = Date.now();
  for (const [orderCode, data] of tempOrderData.entries()) {
    const orderTime = new Date(data.orderMetadata.orderDate).getTime();
    // Remove data older than 24 hours
    if (now - orderTime > 24 * 60 * 60 * 1000) {
      tempOrderData.delete(orderCode);
      console.log(`Cleaned up expired temp data for order: ${orderCode}`);
    }
  }
};
