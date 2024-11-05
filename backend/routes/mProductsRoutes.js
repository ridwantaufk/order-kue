const express = require("express");
const router = express.Router();
const productsController = require("../controllers/mProductsController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tentukan folder tujuan penyimpanan
    cb(null, path.join(__dirname, "../../frontend/src/assets/img/products")); // Ubah path sesuai dengan kebutuhan
  },
  filename: (req, file, cb) => {
    // Menggunakan timestamp untuk nama file agar unik
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/", productsController.getProducts);
router.post("/", upload.single("icon"), productsController.createProduct);
router.put("/:id", productsController.updateProduct);
router.put("/delete/:id", productsController.deleteProduct);

module.exports = router;
