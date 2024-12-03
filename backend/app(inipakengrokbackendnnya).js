const express = require("express");
const ngrok = require("ngrok");
const cors = require("cors");
const app = express();
const sequelize = require("./config/db");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const configurationsRoutes = require("./routes/configurationsRoutes");
const { updateNgrokUrl } = require("./controllers/configurationsController");

const usersRoutes = require("./routes/usersRoutes");
const productsRoutes = require("./routes/mProductsRoutes");
const ordersRoutes = require("./routes/tOrdersRoutes");
const orderItemsRoutes = require("./routes/tOrderItemsRoutes");
const expensesRoutes = require("./routes/vExpensesRoutes");
const costRoutes = require("./routes/mCostsRoutes");
const ingredientRoutes = require("./routes/mIngredientsRoutes");
const toolRoutes = require("./routes/mToolsRoutes");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Backend Aktif !");
});

app.get("/api", (req, res) => {
  res.send("API Aktif !");
});

app.use("/api/configurations", configurationsRoutes);
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
    app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);

      // Start ngrok
      try {
        const ngrokUrl = await ngrok.connect(PORT);
        console.log(`ngrok started at ${ngrokUrl}`);

        // Update ngrok URL in the database
        await updateNgrokUrl(ngrokUrl);
        console.log("ngrok URL updated in database");

        const envPath = path.join(__dirname, "../frontend/.env");
        fs.writeFileSync(envPath, `REACT_APP_BACKEND_URL=${ngrokUrl}\n`);
      } catch (error) {
        console.error("Error starting ngrok:", error.message);
      }
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// Handle process exit to stop ngrok
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  try {
    await ngrok.disconnect();
    console.log("ngrok disconnected");
  } catch (error) {
    console.error("Error disconnecting ngrok:", error.message);
  }
  process.exit(0);
});
