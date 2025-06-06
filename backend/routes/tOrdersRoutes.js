const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/tOrdersController");

router.get("/", ordersController.getOrders);
router.post("/", ordersController.createOrder);
router.put("/:id", ordersController.updateOrder);
router.delete("/:id", ordersController.deleteOrder);

module.exports = router;
