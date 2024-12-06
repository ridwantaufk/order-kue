const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/usersController");

// Route definitions
router.post("/register", createUser); // Register new user
router.get("/users", authMiddleware, getUsers);
router.get("/privateUser/:id", authMiddleware, getUserById); // Get user by ID
router.put("/privateUser/:id", authMiddleware, updateUser);
router.delete("/privateUser/:id", authMiddleware, deleteUser);
router.post("/login", loginUser); // Login user

module.exports = router;
