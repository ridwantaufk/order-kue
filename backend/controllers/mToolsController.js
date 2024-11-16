const Tool = require("../models/mToolModel");

// Get all tools
const getAllTools = async (req, res) => {
  try {
    const tools = await Tool.findAll();
    res.status(200).json(tools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single tool by ID
const getToolById = async (req, res) => {
  try {
    const { id } = req.params;
    const tool = await Tool.findByPk(id);
    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }
    res.status(200).json(tool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new tool
const createTool = async (req, res) => {
  try {
    const { tool_name, tool_description, purchase_date, price, quantity } =
      req.body;
    const newTool = await Tool.create({
      tool_name,
      tool_description,
      purchase_date,
      price,
      quantity,
    });
    res.status(201).json(newTool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a tool by ID
const updateTool = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tool_name,
      tool_description,
      purchase_date,
      price,
      quantity,
      available,
    } = req.body;

    const tool = await Tool.findByPk(id);
    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    tool.tool_name = tool_name;
    tool.tool_description = tool_description;
    tool.purchase_date = purchase_date;
    tool.price = price;
    tool.quantity = quantity;
    tool.available = available;

    await tool.save();
    res.status(200).json(tool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a tool by ID
const deleteTool = async (req, res) => {
  try {
    const { id } = req.params;
    const tool = await Tool.findByPk(id);
    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }
    // console.log("req.body.available : ", req.body.available);
    tool.available = req.body.available;
    await tool.save();

    res.status(200).json({ message: "Tool deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
};
