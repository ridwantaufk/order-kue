const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./config/db");
const bodyParser = require("body-parser");
require("dotenv").config();

const usersRoutes = require("./routes/usersRoutes");
const productsRoutes = require("./routes/mProductsRoutes");
const ordersRoutes = require("./routes/tOrdersRoutes");
const orderItemsRoutes = require("./routes/tOrderItemsRoutes");
const expensesRoutes = require("./routes/vExpensesRoutes");
const costRoutes = require("./routes/mCostsRoutes");
const ingredientRoutes = require("./routes/mIngredientsRoutes");
const toolRoutes = require("./routes/mToolsRoutes");

const corsOptions = {
  origin: "*", // Ganti dengan domain Vercel Anda
  methods: ["GET", "POST", "PUT", "DELETE"], // Sesuaikan dengan metode yang diperlukan
  allowedHeaders: ["Content-Type", "Authorization"], // Header yang diizinkan
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API root endpoint!");
});

app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/orderItems", orderItemsRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/costs", costRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/tools", toolRoutes);

// Sync database and start server
const PORT = process.env.PORT || 5000;
sequelize
  .sync() // Sinkronisasi database
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
