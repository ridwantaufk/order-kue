const express = require("express");
const router = express.Router();
const {
  getAllConfigurations,
  getConfigurationById,
  updateNgrokUrl,
  createConfiguration,
  deleteConfiguration,
} = require("../controllers/configurationsController");

// Routes
router.get("/", getAllConfigurations); // Get all configurations
router.get("/:id", getConfigurationById); // Get specific configuration
router.post("/", createConfiguration); // Create a new configuration
router.put("/ngrok", updateNgrokUrl); // Update ngrok URL
router.delete("/:id", deleteConfiguration); // Delete a configuration

module.exports = router;
