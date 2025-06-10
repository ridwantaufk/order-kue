const Product = require("../models/mProductModel");
const fs = require("fs");
const path = require("path");
const {
  uploadToGitHub,
  deleteFileFromGitHub,
} = require("../utils/githubUploadDelete");
const sequelize = require("../config/db");
const ProductUtils = require("../models/tUtilsProductModel");

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
    const { product_name, description, price, stock, cost_price, category } =
      req.body;
    const icon = req.file ? req.file.filename : null;

    const newProduct = await Product.create({
      product_name,
      description,
      price,
      stock,
      cost_price,
      icon,
      category,
    });

    console.log("New product created:", newProduct);

    // Tambahkan favorite default 0 untuk produk baru
    try {
      console.log("Data sebelum ProductUtils.create:", {
        product_id: newProduct.dataValues.product_id,
        favorite: 0,
      });

      await ProductUtils.create({
        product_id: newProduct.dataValues.product_id,
        favorite: 0,
      });
    } catch (utilsError) {
      console.error("Error in ProductUtils.create:", utilsError);
      return res
        .status(500)
        .json({ message: "Gagal menambahkan data ke ProductUtils" });
    }

    res.status(201).json(newProduct.dataValues);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res
      .status(400)
      .json({ message: error.message || "Gagal menambahkan produk" });
  }
};

// Mengupdate produk
exports.updateProduct = async (req, res) => {
  const isBulkUpdate =
    req.params.id === "0" &&
    (req.body.decreaseStock === "true" || req.body.decreaseStock === true);

  if (isBulkUpdate) {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid items format" });
    }

    const t = await sequelize.transaction();

    try {
      for (const item of items) {
        const { product_id, quantity } = item;
        const product = await Product.findByPk(product_id, { transaction: t });

        if (!product) {
          await t.rollback();
          return res
            .status(404)
            .json({ message: `Produk ID ${product_id} tidak ditemukan.` });
        }

        if (product.stock < quantity) {
          await t.rollback();
          return res.status(400).json({
            message: `Stok untuk produk <b>${
              product.product_name
            }</b> tidak cukup.\nKurang <b>${
              quantity - product.stock
            }</b> unit.`,
          });
        }

        await product.update(
          { stock: product.stock - quantity },
          { transaction: t }
        );
      }

      await t.commit();
      return res.json({ message: "Stok berhasil diperbarui." });
    } catch (error) {
      console.error("Transaction error:", error);
      await t.rollback();
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan saat memperbarui stok." });
    }
  }

  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ambil data dari body permintaan
    const {
      product_name,
      description,
      price,
      cost_price,
      stock,
      icon,
      category,
    } = req.body;
    let iconFile = product.icon;

    // // Cek jika `icon` dari body adalah 'delete', maka hapus ikon lama (berlaku di project local, bukan github. Perhatikan penyimpanan untuk kebutuhan github atau project lokal)
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

    console.log("reqfile : ", req.file);
    console.log("icon : ", icon);
    console.log("product.icon : ", product.icon);
    console.log("icon && product.icon : ", icon === "delete" && product.icon);

    // 1. Jika `icon` dihapus
    // // Cek jika `icon` dari body adalah 'delete', maka hapus ikon lama (berlaku di project github, bukan local. Perhatikan penyimpanan untuk kebutuhan github atau project lokal)
    // if (icon === "delete" && product.icon) {
    //   const filePath = `frontend/public/assets/img/products/${product.icon}`;
    //   console.log("Menghapus icon dari GitHub:", filePath);

    //   try {
    //     // Hapus file ikon dari GitHub
    //     await deleteFileFromGitHub(filePath);
    //     console.log("Icon di GitHub berhasil dihapus");
    //   } catch (error) {
    //     console.error("Gagal menghapus icon di GitHub:", error.message);
    //     return res
    //       .status(500)
    //       .json({ message: "Gagal menghapus icon di GitHub" });
    //   }

    // Set `icon` di database menjadi null setelah dihapus
    //   iconFile = null;
    // }

    // 2. Jika ada file baru yang diupload
    // Hapus icon lama jika ada (berlaku di project github, bukan local. Perhatikan repo/projectnya sesuai kebutuhan)
    if (req.file) {
      // const githubUrl = await uploadToGitHub(req.file, req.file.filename);
      // console.log("URL icon di GitHub:", githubUrl);

      // aktifkan kalo mau simpan nama file saja
      iconFile = req.file.filename;

      // aktifkan jika ingin url gambar github
      // iconFile = githubUrl;
    }

    // Update produk dengan data baru
    await product.update({
      product_name,
      description,
      price,
      cost_price,
      stock,
      icon: iconFile,
      category,
    });

    res.status(200).json({ success: true, product });
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
