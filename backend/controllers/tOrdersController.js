const Order = require("../models/tOrderModel");

// Mendapatkan semua pesanan
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menambahkan pesanan baru
exports.createOrder = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const newOrder = await Order.create({ userId, productId });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mengupdate pesanan
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { userId, productId } = req.body;
    await order.update({ userId, productId });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Menghapus pesanan
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
