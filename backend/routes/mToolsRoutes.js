const express = require("express");
const {
  getAllTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
} = require("../controllers/mToolsController");

const router = express.Router();

router.get("/", getAllTools);
router.get("/:id", getToolById);
router.post("/", createTool);
router.put("/:id", updateTool);
router.put("/delete/:id", deleteTool);

module.exports = router;
