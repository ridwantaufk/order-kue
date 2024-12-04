const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./config/db");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const configurationsRoutes = require("./routes/configurationsRoutes");

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
console.log("process.env.PORT : ", process.env.PORT);

sequelize
  .sync() // Sinkronisasi database
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      // Update .env in frontend with backend production URL
      const envPath = path.join(__dirname, "../frontend/.env");
      if (fs.existsSync(envPath)) {
        const backendUrl = `https://order-kue-production.up.railway.app`; // railway
        // const backendUrl = `https://158d-149-113-206-114.ngrok-free.app`; // ngrok
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
