const express = require("express");
const {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} = require("../controllers/mIngredientsController");

const router = express.Router();

router.get("/", getAllIngredients);
router.get("/:id", getIngredientById);
router.post("/", createIngredient);
router.put("/:id", updateIngredient);
router.put("/delete/:id", deleteIngredient);
// router.delete("/:id", deleteIngredient);

module.exports = router;
