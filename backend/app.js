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

app.use("/api/configurations", configurationsRoutes);
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
app.use("/api", visitorRoutes);

tOrdersController.listenForOrderUpdates(io);

// Inisialisasi Socket.IO
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Mengirim data awal saat klien terhubung
  tOrdersController
    .getOrdersForSocket()
    .then((orders) => {
      socket.emit("initialOrders", orders);
    })
    .catch((error) => {
      console.error("Error fetching initial orders:", error);
    });

  // Emit pembaruan orders langsung (perbaiki event listenernya)
  socket.on("newOrder", (order) => {
    if (order) {
      io.emit("ordersUpdate", order); // Emit update ke semua klien
    } else {
      console.log("No order data received");
    }
  });

  // Mendengarkan perbaruan data
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
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
        const backendUrl = `https://b4c0-139-195-217-191.ngrok-free.app`; // ngrok
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
