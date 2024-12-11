const express = require("express");
const router = express.Router();
const tUtilsProductController = require("../controllers/tUtilsProductController");

// Route untuk menambahkan favorit
router.post("/", tUtilsProductController.addFavoriteProduct);

// Route untuk mengambil semua produk favorit
router.get("/", tUtilsProductController.getAllFavoriteProducts);

// Route untuk mendapatkan produk favorit berdasarkan ID
router.get("/:product_id", tUtilsProductController.getFavoriteProduct);

// Route untuk memperbarui produk favorit
router.put("/:product_id", tUtilsProductController.updateFavoriteProduct);

// Route untuk menghapus produk favorit
router.delete("/:product_id", tUtilsProductController.deleteFavoriteProduct);

module.exports = router;
