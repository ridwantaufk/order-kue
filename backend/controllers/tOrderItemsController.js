const OrderItem = require("../models/tOrderItemModel");
const Order = require("../models/tOrderModel");

// Mendapatkan semua item pesanan
exports.getOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: Order,
        },
      ],
    });
    // console.log("orderItems : ", orderItems);
    res.json(orderItems);
  } catch (error) {
    console.log("error otder : ", error);
    res.status(500).json({ message: error.message });
  }
};

// Menambahkan item pesanan baru
exports.createOrderItem = async (req, res) => {
  try {
    const { orderId, productId, quantity } = req.body;
    const newOrderItem = await OrderItem.create({
      orderId,
      productId,
      quantity,
    });
    res.status(201).json(newOrderItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mengupdate item pesanan
exports.updateOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (!orderItem)
      return res.status(404).json({ message: "Order item not found" });

    const { orderId, productId, quantity } = req.body;
    await orderItem.update({ orderId, productId, quantity });
    res.json(orderItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Menghapus item pesanan
exports.deleteOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (!orderItem)
      return res.status(404).json({ message: "Order item not found" });

    await orderItem.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
