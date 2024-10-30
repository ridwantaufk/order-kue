const User = require("../models/userModel");

// Mendapatkan semua pengguna
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menambahkan pengguna baru
exports.createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const newUser = await User.create({ name, email, age });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mengupdate pengguna
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, age } = req.body;
    await user.update({ name, email, age });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Menghapus pengguna
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
