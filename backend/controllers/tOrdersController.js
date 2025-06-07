const EventEmitter = require("events");
const emitter = new EventEmitter();
const Order = require("../models/tOrderModel");
const tOrdersController = require("../controllers/tOrdersController");
const {
  Order: OrderCombined,
  OrderItem: OrderItemCombined,
  Product,
} = require("../models/OrderModelAndOrderItemModel");

// Mendapatkan semua pesanan
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi tambahan untuk socket.io agar dapat mengambil data
exports.getOrdersForSocket = async () => {
  try {
    const orders = await OrderCombined.findAll({
      include: [
        {
          model: OrderItemCombined,
          attributes: [
            "order_item_id",
            "product_id",
            "quantity",
            "price",
            "created_at",
            "updated_at",
          ],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_name", "icon", "price"],
            },
          ],
        },
      ],
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders for socket:", error);
    return [];
  }
};

exports.notifyOrderUpdate = () => {
  emitter.emit("orderUpdated"); // Emit event untuk pembaruan
};

exports.listenForOrderUpdates = (io) => {
  emitter.on("orderUpdated", async () => {
    try {
      const orders = await exports.getOrdersForSocket(); // Ambil data terbaru
      io.emit("ordersUpdate", orders); // Emit ke semua klien dengan data terbaru
    } catch (error) {
      console.error("Error fetching updated orders:", error);
    }
  });
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
  console.log("req.params.id : ", req.params.id);
  console.log("req.body : ", req.body);
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { status } = req.body;
    await order.update({ status });
    tOrdersController.notifyOrderUpdate();
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
