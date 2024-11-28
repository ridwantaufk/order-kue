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
router.get("/users/:id", getUserById); // Get user by ID
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);
router.post("/login", loginUser); // Login user

module.exports = router;
