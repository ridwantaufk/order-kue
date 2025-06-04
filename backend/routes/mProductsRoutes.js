const express = require("express");
const router = express.Router();
const productsController = require("../controllers/mProductsController");
const multer = require("multer");
const path = require("path");

// khusus upload gambar ke github OPEN ------------------------------
// // Buka BAG 1-2 komenan ini kalo update gambar disimpan di direktori gitHub (biasanya untuk keperluan produksi)
// const storage = multer.memoryStorage(); // Menggunakan memoryStorage agar file tersedia dalam buffer
// const upload = multer({ storage });

// router.put(
//   "/:id",
//   upload.single("icon"), // Upload gambar
//   async (req, res, next) => {
//     const { icon } = req.body;
//     console.log("REQ BODY: ", req.body);
//     console.log("REQ FILE: ", req.file);

//     // Cek apakah ikon akan dihapus atau diganti
//     if (icon === "delete" || (req.file && req.body.icon !== "delete")) {
//       return next(); // Lanjutkan jika ada file atau ikon diganti
//     }

//     // Lanjutkan tanpa upload file jika tidak ada perubahan ikon
//     next();
//   },
//   productsController.updateProduct // Fungsi untuk update produk
// );
// khusus upload gambar ke github CLOSE -----------------------------

// Buka BAG 1-2 komenan ini kalo update gambar disimpan di direktori lokal (biasanya untuk keperluan develop) BAGIAN 1
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tentukan folder tujuan penyimpanan
    cb(null, path.join(__dirname, "../../frontend/public/assets/img/products"));
  },
  filename: (req, file, cb) => {
    // Menggunakan timestamp untuk nama file agar unik
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// BAGIAN 2
router.put(
  "/:id",
  upload.single("icon"),
  (req, res, next) => {
    const { icon } = req.body;
    console.log("REQ BODY: ", req.body);
    console.log("REQ FILE: ", req.file);

    // Cek apakah ikon akan dihapus atau diganti
    if (icon === "delete" || (req.file && req.body.icon !== "delete")) {
      return next(); // Lanjutkan jika ada file atau ikon diganti
    }

    // Lanjutkan tanpa upload file jika tidak ada perubahan ikon
    next();
  },
  productsController.updateProduct // Fungsi untuk update produk
);

router.get("/", productsController.getProducts);
router.post("/", upload.single("icon"), productsController.createProduct);
router.put("/delete/:id", productsController.deleteProduct);

module.exports = router;
