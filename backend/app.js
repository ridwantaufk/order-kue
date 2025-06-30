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
const { Op } = require("sequelize");
const ChatSession = require("./models/chatSessionModel");
const ChatMessage = require("./models/chatMessageModel");
const requestLogger = require("./middlewares/requestLogger");

app.use(requestLogger);

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

      const orderCodes = orderCode
        .split(",")
        .map((code) => code.trim())
        .filter((code) => code.length > 0);

      // Simpan semua kode ke buyerSockets
      orderCodes.forEach((code) => {
        buyerSockets.set(code, socket.id);
      });

      console.log("buyerSockets : ", buyerSockets);
      socket.orderCode = orderCodes.join(",");
      socket.userType = "buyer";

      console.log(`Buyer with order ${orderCodes.join(", ")} joined chat`);

      const sessions = await ChatSession.findAll({
        where: {
          order_code: {
            [Op.in]: orderCodes,
          },
        },
      });

      if (sessions.length === 1) {
        let session = sessions[0];

        socket.emit("chat_session", session);

        const messages = await ChatMessage.findAll({
          where: { session_id: session.session_id },
          order: [["created_at", "ASC"]],
        });

        socket.emit("chat_messages", messages);

        adminSockets.forEach((adminSocketId) => {
          io.to(adminSocketId).emit("buyer_online", {
            orderCode: orderCodes[0],
            online: true,
          });
        });
      } else if (sessions.length > 1) {
        console.warn(
          `Terdapat banyak session untuk order_codes: ${orderCodes.join(", ")}`
        );

        const allMessages = await ChatMessage.findAll({
          where: {
            session_id: {
              [Op.in]: sessions.map((s) => s.session_id),
            },
          },
          order: [["created_at", "ASC"]],
        });

        socket.emit("chat_sessions", sessions);
        socket.emit("chat_messages", allMessages);

        adminSockets.forEach((adminSocketId) => {
          io.to(adminSocketId).emit("buyer_online", {
            orderCodes,
            online: true,
          });
        });
      } else {
        console.log("Tidak ada session yang ditemukan.");
      }
    } catch (error) {
      console.error("Buyer join error :", error);
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

  socket.on("typing", async ({ session_id, typing, user_id, order_code }) => {
    try {
      if (socket.userType === "admin") {
        const session = await ChatSession.findOne({
          where: { session_id },
        });

        if (session && buyerSockets.has(session.order_code)) {
          const buyerSocketId = buyerSockets.get(session.order_code);
          io.to(buyerSocketId).emit("admin_typing", { typing });
        }
      } else if (socket.userType === "buyer") {
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

  socket.on(
    "mark_messages_read",
    async ({ session_id, user_id, order_code }) => {
      try {
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

  socket.on("order_status_changed", async ({ orderId, newStatus }) => {
    if (newStatus === "Diterima") {
      console.log(
        `Order ${orderId} status Diterima. Mulai countdown 10 menit.`
      );

      // Jalankan timer 10 menit
      setTimeout(async () => {
        try {
          const deleted = await ChatSession.destroy({
            where: { order_id: orderId },
          });

          if (deleted) {
            console.log(
              `Chat session untuk order ${orderId} berhasil dihapus setelah 10 menit.`
            );
          } else {
            console.log(
              `Tidak ditemukan chat session untuk order ${orderId} saat penghapusan.`
            );
          }
        } catch (err) {
          console.error("Gagal menghapus chat session:", err);
        }
      }, 1 * 60 * 1000); // 1 menit
    }
  });

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

    if (socket.userType === "buyer" && socket.orderCode) {
      const orderCodes = socket.orderCode
        .split(",")
        .map((code) => code.trim())
        .filter((code) => code.length > 0);

      orderCodes.forEach((code) => {
        buyerSockets.delete(code);

        // Notify admin bahwa buyer offline
        adminSockets.forEach((adminSocketId) => {
          io.to(adminSocketId).emit("buyer_online", {
            orderCode: code,
            online: false,
          });
        });
      });

      console.log(`Buyer with order ${orderCodes.join(", ")} disconnected`);
    }

    // Remove from adminSockets
    for (let [userId, socketId] of adminSockets.entries()) {
      if (socketId === socket.id) {
        adminSockets.delete(userId);
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

      // === SETUP URL BACKEND ===
      // const backendUrl = `https://order-kue-production.up.railway.app`; // railway
      // const backendUrl = `https://4ca8-114-10-145-104.ngrok-free.app`; // ngrok
      const backendUrl = `http://localhost:5000`;
      // const backendUrl = `http://127.0.0.1:5000`; // sama seperti localhost, tapi versi IPv4
      // const backendUrl = `http://140.0.67.211:5000`; // IP Public Router Rumah
      // const backendUrl = `http://172.20.10.4:5000`; // IPv4 iphone hotspot
      // const backendUrl = `https://mighty-wings-vanish.loca.lt`;
      // const backendUrl = `https://estimated-else-horse-fairly.trycloudflare.com`;

      console.log("ada backend url : ", backendUrl);

      // === FUNGSI UPDATE .ENV ===
      function updateEnvVariable(envPath, key, value) {
        if (!fs.existsSync(envPath)) return;

        let envContent = fs.readFileSync(envPath, "utf8");
        const regex = new RegExp(`^${key}=.*$`, "m");

        if (regex.test(envContent)) {
          envContent = envContent.replace(regex, `${key}=${value}`);
        } else {
          envContent += `\n${key}=${value}\n`;
        }

        fs.writeFileSync(envPath, envContent);
      }

      // === UPDATE FRONTEND .env ===
      const frontendEnvPath = path.join(__dirname, "../frontend/.env");
      if (fs.existsSync(frontendEnvPath)) {
        updateEnvVariable(frontendEnvPath, "REACT_APP_BACKEND_URL", backendUrl);
        console.log(
          "URL Backend terupdate di frontend .env (REACT_APP_BACKEND_URL)"
        );
      } else {
        console.log(".env file tidak ditemukan di frontend/");
      }

      // === UPDATE BACKEND .env ===
      const backendEnvPath = path.join(__dirname, "../backend/.env");
      if (fs.existsSync(backendEnvPath)) {
        updateEnvVariable(backendEnvPath, "BACKEND_URL", backendUrl);
        console.log("URL Backend terupdate di backend .env (BACKEND_URL)");
      } else {
        console.log(".env file tidak ditemukan di backend/");
      }
    });
  })
  .catch((error) => {
    console.error("Error sinkronisasi database: ", error);
  });
