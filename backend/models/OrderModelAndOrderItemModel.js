// models/OrderModelAndOrderItemModel.js
const Order = require("./tOrderModel");
const OrderItem = require("./tOrderItemModel");
const Product = require("./mProductModel");

// Relasi antar model
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" }); // ✅ relasi ke produk

module.exports = { Order, OrderItem, Product };
