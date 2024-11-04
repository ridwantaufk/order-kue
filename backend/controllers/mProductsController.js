const Product = require("../models/mProductModel");

// Mendapatkan semua produk
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menambahkan produk baru
exports.createProduct = async (req, res) => {
  try {
    const { product_name, description, price, stock, cost_price, icon } =
      req.body;

    const newProduct = await Product.create({
      product_name,
      description,
      price,
      stock,
      cost_price,
      icon,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mengupdate produk
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ambil data dari body permintaan
    const { product_name, description, price, cost_price, stock } = req.body;

    // Update produk dengan data baru
    await product.update({
      product_name,
      description,
      price,
      cost_price,
      stock,
    });
    // Kembalikan produk yang telah diperbarui
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Menghapus produk
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Melakukan soft delete dengan mengatur stock ke 0 dan available ke false
    await product.update({
      stock: 0,
      available: false,
    });

    res.status(204).send(); // Mengirim status 204 No Content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
