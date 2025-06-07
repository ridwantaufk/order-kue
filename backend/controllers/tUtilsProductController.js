const ProductUtils = require("../models/tUtilsProductModel");

// Menambahkan produk ke favorit
const addFavoriteProduct = async (req, res) => {
  const { product_id, favorite } = req.body;

  try {
    const newFavorite = await ProductUtils.create({ product_id, favorite });
    res.status(201).json(newFavorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mengambil semua produk favorit
const getAllFavoriteProducts = async (req, res) => {
  try {
    const products = await ProductUtils.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mengambil produk favorit berdasarkan product_id
const getFavoriteProduct = async (req, res) => {
  const { product_id } = req.params;

  try {
    const product = await ProductUtils.findOne({ where: { product_id } });
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log("product_id : ", product_id);
    res.status(500).json({ error: error.message });
  }
};

// Memperbarui produk favorit
const updateFavoriteProduct = async (req, res) => {
  const { product_id } = req.params;
  const { favorite } = req.body;

  try {
    const [updated] = await ProductUtils.update(
      { favorite },
      {
        where: { product_id },
      }
    );
    if (!updated) {
      return res.status(404).json({ message: "Product not found." });
    }
    const updatedProduct = await ProductUtils.findOne({
      where: { product_id },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Menghapus produk favorit
const deleteFavoriteProduct = async (req, res) => {
  const { product_id } = req.params;

  try {
    const deleted = await ProductUtils.destroy({
      where: { product_id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(204).send(); // Mengembalikan status 204 No Content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export semua fungsi controller
module.exports = {
  addFavoriteProduct,
  getAllFavoriteProducts,
  getFavoriteProduct,
  updateFavoriteProduct,
  deleteFavoriteProduct,
};
