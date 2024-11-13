const express = require("express");
const router = express.Router();
const costController = require("../controllers/mCostsController");

router.post("/", costController.createCost);
router.get("/", costController.getAllCosts);
router.get("/:id", costController.getCostById);
router.put("/:id", costController.updateCost);
router.delete("/:id", costController.deleteCost);

module.exports = router;
