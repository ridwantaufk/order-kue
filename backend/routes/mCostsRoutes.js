const express = require("express");
const router = express.Router();
const costController = require("../controllers/mCostsController");

router.post("/", costController.createCost);
router.get("/", costController.getAllCosts);
router.put("/:id", costController.updateCost);
router.put("/delete/:id", costController.deleteCost);

module.exports = router;
