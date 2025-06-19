const express = require("express");
const sequelize = require("./config/db");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const tOrdersController = require("./controllers/tOrdersController");
require("dotenv").config();

const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// Inisialisasi server HTTP dan Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Ganti dengan URL frontend jika di produksi demi keamanan
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"], // Gunakan fallback polling
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Test Endpoint
app.get("/", (req, res) => {
  res.send("Backend Aktif!");
});

app.get("/api", (req, res) => {
  res.send("API Aktif!");
});

// Routes
const configurationsRoutes = require("./routes/configurationsRoutes");
const dashboardRoutes = require("./routes/vDashboardRoutes");
const usersRoutes = require("./routes/usersRoutes");
const productsRoutes = require("./routes/mProductsRoutes");
const ordersRoutes = require("./routes/tOrdersRoutes");
const orderItemsRoutes = require("./routes/tOrderItemsRoutes");
const expensesRoutes = require("./routes/vExpensesRoutes");
const costRoutes = require("./routes/mCostsRoutes");
const ingredientRoutes = require("./routes/mIngredientsRoutes");
const toolRoutes = require("./routes/mToolsRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const tUtilsProductRoutes = require("./routes/tUtilsProductRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use("/api/configurations", configurationsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/orderItems", orderItemsRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/costs", costRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/favorite", tUtilsProductRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", visitorRoutes);

tOrdersController.listenForOrderUpdates(io);

const adminSockets = new Map();
const buyerSockets = new Map();

// Inisialisasi Socket.IO
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Admin join chat
  socket.on("admin_join", async ({ userId, token }) => {
    try {
      // Verify admin token here if needed
      adminSockets.set(userId, socket.id);
      socket.userId = userId;
      socket.userType = "admin";

      console.log(`Admin ${userId} joined chat`);

      // Send all chat sessions to admin
      const ChatSession = require("./models/chatSessionModel");
      const ChatMessage = require("./models/chatMessageModel");

      const sessions = await ChatSession.findAll({
        include: [
          {
            model: ChatMessage,
            order: [["created_at", "DESC"]],
            limit: 1,
          },
        ],
        order: [["created_at", "DESC"]],
      });

      socket.emit("chat_sessions", sessions);
    } catch (error) {
      console.error("Admin join error:", error);
    }
  });

  socket.on("buyer_join", async ({ orderCode }) => {
    try {
      console.log("orderCode", orderCode);
      buyerSockets.set(orderCode, socket.id);
      console.log("buyerSockets", buyerSockets);
      socket.orderCode = orderCode;
      socket.userType = "buyer";

      console.log(`Buyer with order ${orderCode} joined chat`);

      const ChatSession = require("./models/chatSessionModel");
      const ChatMessage = require("./models/chatMessageModel");

      let session = await ChatSession.findOne({
        where: { order_code: orderCode },
      });

      if (!session) {
        session = await ChatSession.create({
          order_code: orderCode,
          status: "active",
        });
      }

      socket.emit("chat_session", session);

      const messages = await ChatMessage.findAll({
        where: { session_id: session.session_id },
        order: [["created_at", "ASC"]],
      });

      socket.emit("chat_messages", messages);

      adminSockets.forEach((adminSocketId) => {
        io.to(adminSocketId).emit("buyer_online", {
          orderCode,
          online: true,
        });
      });
    } catch (error) {
      console.error("Buyer join error:", error);
    }
  });

  // Handle sending messages
  socket.on("send_message", async (messageData) => {
    try {
      console.log("Broadcasting message:", messageData);

      // Broadcast to admin sockets
      adminSockets.forEach((adminSocketId) => {
        if (adminSocketId !== socket.id) {
          io.to(adminSocketId).emit("new_message", messageData);
        }
      });

      console.log("messageData.sender_type", messageData.sender_type);
      // Broadcast to buyer socket
      if (messageData.sender_type === "admin") {
        // Find buyer socket by session
        const ChatSession = require("./models/chatSessionModel");
        const session = await ChatSession.findOne({
          where: { session_id: messageData.session_id },
        });
        console.log(
          "buyerSockets.has(session.order_code",
          buyerSockets.has(session.order_code)
        );
        if (session && buyerSockets.has(session.order_code)) {
          const buyerSocketId = buyerSockets.get(session.order_code);
          io.to(buyerSocketId).emit("new_message", messageData);
        }
      }

      // If message from buyer, broadcast to all admins
      if (messageData.sender_type === "buyer" && socket.orderCode) {
        adminSockets.forEach((adminSocketId) => {
          io.to(adminSocketId).emit("new_message", messageData);
        });
      }
    } catch (error) {
      console.error("Send message error:", error);
    }
  });

  // Handle typing indicators
  socket.on("typing", async ({ session_id, typing, user_id, order_code }) => {
    try {
      if (socket.userType === "admin") {
        // Admin typing - send to buyer
        const ChatSession = require("./models/chatSessionModel");
        const session = await ChatSession.findOne({
          where: { session_id },
        });

        if (session && buyerSockets.has(session.order_code)) {
          const buyerSocketId = buyerSockets.get(session.order_code);
          io.to(buyerSocketId).emit("admin_typing", { typing });
        }
      } else if (socket.userType === "buyer") {
        // Buyer typing - send to all admins
        adminSockets.forEach((adminSocketId) => {
          io.to(adminSocketId).emit("user_typing", {
            session_id,
            user_id: order_code,
            typing,
          });
        });
      }
    } catch (error) {
      console.error("Typing error:", error);
    }
  });

  // Mark messages as read
  socket.on(
    "mark_messages_read",
    async ({ session_id, user_id, order_code }) => {
      try {
        const ChatMessage = require("./models/chatMessageModel");

        // Update read status in database
        if (socket.userType === "admin") {
          await ChatMessage.update(
            { read_at: new Date() },
            {
              where: {
                session_id,
                sender_type: "buyer",
                read_at: null,
              },
            }
          );
        } else if (socket.userType === "buyer") {
          await ChatMessage.update(
            { read_at: new Date() },
            {
              where: {
                session_id,
                sender_type: "admin",
                read_at: null,
              },
            }
          );
        }

        // Broadcast read status
        io.emit("messages_marked_read", { session_id });
      } catch (error) {
        console.error("Mark read error:", error);
      }
    }
  );

  // Existing order functionality
  tOrdersController
    .getOrdersForSocket()
    .then((orders) => {
      socket.emit("initialOrders", orders);
    })
    .catch((error) => {
      console.error("Error fetching initial orders:", error);
    });

  socket.on("newOrder", (order) => {
    if (order) {
      io.emit("ordersUpdate", order); // Emit update ke semua klien
    } else {
      console.log("No order data received");
    }
  });
  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);

    // Remove from admin sockets
    for (let [userId, socketId] of adminSockets.entries()) {
      if (socketId === socket.id) {
        adminSockets.delete(userId);
        break;
      }
    }

    // Remove from buyer sockets and notify admin
    for (let [orderCode, socketId] of buyerSockets.entries()) {
      if (socketId === socket.id) {
        buyerSockets.delete(orderCode);

        // Notify admin that buyer is offline
        adminSockets.forEach((adminSocketId) => {
          io.to(adminSocketId).emit("buyer_online", {
            orderCode,
            online: false,
          });
        });
        break;
      }
    }
  });
});

// Sync database and start server
const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    console.log("Database disinkronkan");
    server.listen(PORT, () => {
      console.log(`Server berjalan pada port ${PORT}`);
      const envPath = path.join(__dirname, "../frontend/.env");
      if (fs.existsSync(envPath)) {
        // const backendUrl = `https://order-kue-production.up.railway.app`; // railway
        // const backendUrl = `https://1fd7-140-0-53-148.ngrok-free.app`; // ngrok
        const backendUrl = `http://localhost:5000`;
        // const backendUrl = `http://127.0.0.1:5000`; // sama seperti localhost, tapi versi IPv4
        // const backendUrl = `http://140.0.70.135:5000`;
        // const backendUrl = `https://mighty-wings-vanish.loca.lt`;
        // const backendUrl = `https://estimated-else-horse-fairly.trycloudflare.com`;
        console.log("ada backend url : ", backendUrl);
        fs.writeFileSync(envPath, `REACT_APP_BACKEND_URL=${backendUrl}\n`);
        console.log(
          "URL Backend terupdate di frontend .env (berarti ini pake ngrok backend-nya)"
        );
      } else {
        console.log(
          ".env file ga ada di frontend directory (berarti ini pake railway backend-nya)"
        );
      }
    });
  })
  .catch((error) => {
    console.error("Error sinkronisasi database: ", error);
  });
