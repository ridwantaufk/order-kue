const Product = require("../models/mProductModel");
const fs = require("fs");
const path = require("path");
const { uploadToGitHub } = require("../utils/githubUpload");

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
    const { product_name, description, price, stock, cost_price } = req.body;
    const icon = req.file ? req.file.filename : null;

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
    const { product_name, description, price, cost_price, stock, icon } =
      req.body;
    let iconFile = product.icon;

    // Cek jika `icon` dari body adalah 'delete', maka hapus ikon lama
    if (icon === "delete" && product.icon) {
      const iconPath = path.join(
        __dirname,
        "..",
        "..",
        "frontend",
        "public",
        "assets",
        "img",
        "products",
        product.icon
      );
      if (fs.existsSync(iconPath)) {
        fs.unlinkSync(iconPath);
      }
      iconFile = null; // Set icon ke null di database
    }

    if (req.file) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "frontend",
        "public",
        "assets",
        "img",
        "products",
        req.file.filename
      );
      const githubUrl = await uploadToGitHub(filePath, req.file.filename);

      // Hapus ikon lama jika ada
      if (product.icon) {
        const oldIconPath = path.join(
          __dirname,
          "..",
          "..",
          "frontend",
          "public",
          "assets",
          "img",
          "products",
          product.icon
        );
        if (fs.existsSync(oldIconPath)) {
          fs.unlinkSync(oldIconPath);
        }
      }

      // aktifkan kalo database lokal
      // iconFile = req.file.filename;

      iconFile = githubUrl;
    }

    // Update produk dengan data baru
    await product.update({
      product_name,
      description,
      price,
      cost_price,
      stock,
      icon: iconFile,
    });

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
