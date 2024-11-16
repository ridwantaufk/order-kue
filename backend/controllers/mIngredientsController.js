const Ingredient = require("../models/mIngredientModel");

// Get all ingredients
const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll();
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single ingredient by ID
const getIngredientById = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new ingredient
const createIngredient = async (req, res) => {
  try {
    const { ingredient_name, quantity, unit, price_per_unit } = req.body;
    const newIngredient = await Ingredient.create({
      ingredient_name,
      quantity,
      unit,
      price_per_unit,
    });
    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an ingredient by ID
const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredient_name, quantity, price_per_unit, unit, available } =
      req.body;

    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    ingredient.ingredient_name = ingredient_name;
    ingredient.quantity = quantity;
    ingredient.price_per_unit = price_per_unit;
    ingredient.unit = unit;
    ingredient.available = available;

    await ingredient.save();
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an ingredient by ID
const deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ message: "ingredient not found" });
    }

    await ingredient.update({
      available: req.body.available,
    });

    res.status(204).send(); // Mengirim status 204 No Content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};
