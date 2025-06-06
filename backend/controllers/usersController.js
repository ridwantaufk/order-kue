const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const createUser = async (req, res) => {
  const {
    name,
    username,
    password,
    age,
    birth_date,
    phone_number,
    address,
    role,
  } = req.body;

  console.log("ISI REGISTER : ", req.body);

  // Validasi sederhana
  if (!name || !username || !password || !role) {
    return res.status(400).json({ message: "Field bertanda (* wajib diisi !" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      age: age || null,
      birth_date: birth_date || null,
      phone_number: phone_number || null,
      address: address || null,
      role,
    });

    res.status(201).json({ message: "User berhasil dibuat", user });
  } catch (error) {
    console.error("Error saat membuat user:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat membuat user",
      error: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== parseInt(id)) {
    return res.status(403).json({ message: "Forbidden!" });
  }

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    username,
    password,
    age,
    birth_date,
    phone_number,
    address,
    role,
  } = req.body;
  console.log("req.body update : ", req.body);

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const updatedData = {
      name,
      username,
      age,
      birth_date,
      phone_number,
      address,
      role,
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updatedData);
    res.status(200).json({ message: "User berhasil diperbarui", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    await user.destroy();
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Mencari user berdasarkan username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: "Username tidak ditemukan" });
    }

    // Verifikasi password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Password yang anda masukkan salah" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    // Kirimkan respons dengan token
    res.status(200).json({
      message: "Login berhasil",
      id: user.id,
      token,
      username: user.username,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
};
