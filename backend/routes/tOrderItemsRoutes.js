const express = require("express");
const router = express.Router();
const orderItemsController = require("../controllers/tOrderItemsController");

router.get("/", orderItemsController.getOrderItems);
router.post("/", orderItemsController.createOrderItem);
router.put("/:id", orderItemsController.updateOrderItem);
router.delete("/:id", orderItemsController.deleteOrderItem);

module.exports = router;
