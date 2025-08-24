const Order = require("../models/tOrderModel");
const OrderItem = require("../models/tOrderItemModel");
const tOrdersController = require("../controllers/tOrdersController");
const sequelize = require("../config/db");
const { Op } = require("sequelize");
const ChatSession = require("../models/chatSessionModel");
const ChatMessage = require("../models/chatMessageModel");
const User = require("../models/userModel");
const midtransClient = require("midtrans-client");
const { default: axios } = require("axios");

// Helper function for input validation
const validateInput = (customerInfo, paymentDetails) => {
  if (!customerInfo || !paymentDetails?.price) {
    return "Invalid request data";
  }
  if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
    return "Customer name, phone, and address are required";
  }
  const phoneRegex = /^(\+62|62|0)[8][1-9][0-9]{6,9}$/;
  if (!phoneRegex.test(customerInfo.phone)) {
    return "Invalid Indonesian phone number format";
  }
  if (customerInfo.customer_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.customer_email)) {
      return "Invalid email format";
    }
  }
  const { itemQuantity, itemPrice } = paymentDetails;
  if (!itemQuantity || !itemPrice || Object.keys(itemQuantity).length === 0) {
    return "At least one item must be ordered with quantity and price";
  }
  if (
    Object.keys(itemQuantity).length !== Object.keys(itemPrice).length ||
    !Object.keys(itemQuantity).every((key) =>
      Object.keys(itemPrice).includes(key)
    )
  ) {
    return "Mismatch between item quantity and price data";
  }
  return null;
};

exports.initiatePayment = async (req, res) => {
  const { customerInfo, paymentDetails, orderMetadata } = req.body;

  // 1. Validate Input
  const validationError = validateInput(customerInfo, paymentDetails);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const transaction = await sequelize.transaction();

  try {
    // 2. Create Order, Items, and Chat Session in DB FIRST
    const newOrder = await Order.create(
      {
        order_code: customerInfo.order_code,
        customer_name: customerInfo.name.trim(),
        customer_phone: customerInfo.phone.trim(),
        customer_address: customerInfo.address.trim(),
        location_latitude: customerInfo.location?.latitude || null,
        location_longitude: customerInfo.location?.longitude || null,
        order_date: orderMetadata?.orderDate || new Date(),
        device_info: orderMetadata?.deviceInfo || null,
        status: "Menunggu",
        email: customerInfo.customer_email || null,
      },
      { transaction }
    );

    const itemKeys = Object.keys(paymentDetails.itemQuantity);
    const orderItems = itemKeys.map((key) => ({
      order_id: newOrder.order_id,
      product_id: parseInt(key),
      quantity: paymentDetails.itemQuantity[key],
      price: paymentDetails.itemPrice[key],
    }));
    await OrderItem.bulkCreate(orderItems, { transaction });

    const admin = await User.findOne({
      where: { role: { [Op.iLike]: "admin" } },
      transaction,
    });

    const newSession = await ChatSession.create(
      {
        order_id: newOrder.order_id,
        order_code: newOrder.order_code,
        created_by_device: orderMetadata?.deviceInfo,
        assigned_admin_id: admin?.id || null,
      },
      { transaction }
    );

    await ChatMessage.create(
      {
        session_id: newSession.session_id,
        sender_type: "admin",
        sender_id: admin?.id || 1, // Fallback to 1 if no admin found
        message: `Pesanan ${newOrder.order_code} telah dibuat. Silakan selesaikan pembayaran untuk melanjutkan.`,
      },
      { transaction }
    );

    // 3. Prepare Midtrans Payment
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const productsResponse = await axios.get(
      `${process.env.BACKEND_URL}/api/products`,
      { headers: { "ngrok-skip-browser-warning": "true" } }
    );
    const products = productsResponse.data;

    console.log("Creating Midtrans transaction with details:", products);

    const parameter = {
      transaction_details: {
        order_id: newOrder.order_code,
        gross_amount: paymentDetails.price,
      },
      customer_details: {
        first_name: newOrder.customer_name,
        email: newOrder.email || "an161016taufik@gmail.com",
        phone: newOrder.customer_phone,
      },
      item_details: Object.entries(paymentDetails.itemQuantity).map(
        ([product_id, quantity]) => {
          const price = paymentDetails.itemPrice[product_id];
          const productName =
            products.find((p) => p.product_id === Number(product_id))
              ?.product_name || `Produk ${product_id}`;
          return { id: product_id, name: productName, price, quantity };
        }
      ),
    };

    const snapResponse = await snap.createTransaction(parameter);

    // 4. If all successful, commit transaction and send response
    await transaction.commit();

    // Notify frontend about the new order
    if (typeof tOrdersController?.notifyOrderUpdate === "function") {
      tOrdersController.notifyOrderUpdate();
    }

    console.log(`Payment initiated for new order: ${newOrder.order_code}`);
    return res.json({
      snapToken: snapResponse.token,
      orderId: newOrder.order_code,
      redirectUrl: snapResponse.redirect_url,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Payment initiation error:", error);
    return res.status(500).json({
      message: "Failed to initiate payment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.handleMidtransWebhook = async (req, res) => {
  const notification = req.body;
  const {
    order_id: orderCode,
    transaction_status: transactionStatus,
    payment_type: paymentType,
    fraud_status: fraudStatus,
    va_numbers,
    bill_key,
  } = notification;

  const vaNumber = va_numbers?.[0]?.va_number || bill_key;

  console.log(
    `Webhook received for order: ${orderCode}, status: ${transactionStatus}`
  );

  // Determine order status
  let newStatus;
  if (
    transactionStatus === "settlement" ||
    (transactionStatus === "capture" && fraudStatus === "accept")
  ) {
    newStatus = "Sedang diproses";
  } else if (["cancel", "expire", "failure"].includes(transactionStatus)) {
    newStatus = "Batal";
  } else if (transactionStatus === "pending") {
    newStatus = "Menunggu";
  } else {
    // For other statuses like 'deny', we can treat them as 'Batal' or just log them
    console.log(`Unhandled transaction status: ${transactionStatus}`);
    return res
      .status(200)
      .json({ message: "Webhook received, no action needed." });
  }

  const transaction = await sequelize.transaction();
  try {
    const order = await Order.findOne({ where: { order_code: orderCode } });

    if (!order) {
      console.error(`Webhook error: Order ${orderCode} not found in database.`);
      await transaction.rollback();
      // Return 200 so Midtrans doesn't retry a webhook for a non-existent order
      return res
        .status(200)
        .json({ message: "Order not found, webhook ignored." });
    }

    // Only update if the status is different
    if (order.status === newStatus) {
      await transaction.commit();
      return res.status(200).json({ message: "Status already updated." });
    }

    // Update order status
    await Order.update(
      {
        status: newStatus,
        payment_type: paymentType,
        va_number: vaNumber || order.va_number, // Keep old VA if new one isn't provided
        updated_at: new Date(),
      },
      { where: { order_code: orderCode }, transaction }
    );

    // Add a chat message for significant status updates
    let chatMessage;
    if (newStatus === "Sedang diproses") {
      chatMessage = `Pembayaran telah diterima! Pesanan Anda sedang kami proses.`;

      // Decrease stock only when payment is confirmed
      const orderItems = await OrderItem.findAll({
        where: { order_id: order.order_id },
      });
      if (orderItems.length > 0) {
        await axios.put(`${process.env.BACKEND_URL}/api/products/0`, {
          decreaseStock: true,
          items: orderItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
        });
      }
    } else if (newStatus === "Batal") {
      chatMessage = `Pesanan Anda telah dibatalkan.`;
    }

    if (chatMessage) {
      const chatSession = await ChatSession.findOne({
        where: { order_code: orderCode },
        transaction,
      });
      if (chatSession) {
        const admin = await User.findOne({
          where: { role: { [Op.iLike]: "admin" } },
          transaction,
        });
        await ChatMessage.create(
          {
            session_id: chatSession.session_id,
            sender_type: "admin",
            sender_id: admin?.id || 1,
            message: chatMessage,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    if (typeof tOrdersController?.notifyOrderUpdate === "function") {
      tOrdersController.notifyOrderUpdate();
    }

    console.log(`Order ${orderCode} updated to status: ${newStatus}`);
    return res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Webhook processing error:", error);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
};
