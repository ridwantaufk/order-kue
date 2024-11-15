const Cost = require("../models/mCostModel");

// Menambahkan data cost baru
exports.createCost = async (req, res) => {
  try {
    const { cost_name, cost_description, amount, cost_date } = req.body;
    const cost = await Cost.create({
      cost_name,
      cost_description,
      amount,
      cost_date,
    });
    res.status(201).json({ message: "Cost created successfully", data: cost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create cost", error: error.message });
  }
};

// Mendapatkan semua data cost
exports.getAllCosts = async (req, res) => {
  try {
    const costs = await Cost.findAll();
    res.status(200).json(costs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve costs", error: error.message });
  }
};

// Mendapatkan data cost berdasarkan ID
exports.getCostById = async (req, res) => {
  try {
    const { id } = req.params;
    const cost = await Cost.findByPk(id);

    if (!cost) {
      return res.status(404).json({ message: "Cost not found" });
    }

    res.status(200).json(cost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve cost", error: error.message });
  }
};

// Mengupdate data cost berdasarkan ID
exports.updateCost = async (req, res) => {
  try {
    const { id } = req.params;
    const { cost_name, cost_description, amount, cost_date, active } = req.body;

    const cost = await Cost.findByPk(id);
    if (!cost) {
      return res.status(404).json({ message: "Cost not found" });
    }

    await cost.update({
      cost_name,
      cost_description,
      amount,
      cost_date,
      active,
    });

    res.status(200).json({ message: "Cost updated successfully", data: cost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update cost", error: error.message });
  }
};

// Menghapus data cost berdasarkan ID
exports.deleteCost = async (req, res) => {
  try {
    const cost = await Cost.findByPk(req.params.id);
    if (!cost) {
      return res.status(404).json({ message: "Cost not found" });
    }

    await cost.update({
      active: req.body.active,
    });

    res.status(204).send(); // Mengirim status 204 No Content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
