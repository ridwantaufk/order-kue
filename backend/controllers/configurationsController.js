const axios = require("axios");
const Configuration = require("../models/configurationModel");

// Get all configurations
const getAllConfigurations = async (req, res) => {
  try {
    const configurations = await Configuration.findAll();
    res.status(200).json(configurations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific configuration
const getConfigurationById = async (req, res) => {
  const { id } = req.params;
  try {
    const configuration = await Configuration.findByPk(id);
    if (!configuration) {
      return res.status(404).json({ error: "Configuration not found" });
    }
    res.status(200).json(configuration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update ngrok URL
const updateNgrokUrl = async () => {
  try {
    // Panggil ngrok API untuk mendapatkan URL ngrok yang aktif
    const response = await axios.get("http://127.0.0.1:4040/api/tunnels");
    const tunnels = response.data.tunnels;

    // Ambil URL ngrok yang aktif (HTTP)
    const ngrokUrl = tunnels.find(
      (tunnel) => tunnel.proto === "https"
    )?.public_url;

    console.log("response : ", ngrokUrl);

    if (!ngrokUrl) {
      console.error("Ngrok URL tidak ditemukan");
      return;
    }

    // Ambil URL backend dari database
    const currentConfig = await Configuration.findByPk(1); // Sesuaikan dengan id Anda
    if (!currentConfig) {
      console.error("Data Configuration tidak ditemukan di database");
      return;
    }

    // Cek apakah URL sudah sama
    if (currentConfig.url_backend === ngrokUrl) {
      console.log("Ngrok URL sudah diperbarui.");
      return;
    }

    // Update database dengan URL baru
    await Configuration.update(
      { url_backend: ngrokUrl },
      { where: { config_id: 1 } } // Sesuaikan dengan id Anda
    );

    console.log(`URL backend updated to: ${ngrokUrl}`);
  } catch (error) {
    console.error("Error updating ngrok URL:", error.message);
  }
};

// Create a new configuration
const createConfiguration = async (req, res) => {
  const { url, port } = req.body;
  try {
    const newConfig = await Configuration.create({ url, port });
    res.status(201).json(newConfig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a configuration
const deleteConfiguration = async (req, res) => {
  const { id } = req.params;
  try {
    const configuration = await Configuration.findByPk(id);
    if (!configuration) {
      return res.status(404).json({ error: "Configuration not found" });
    }
    await configuration.destroy();
    res.status(200).json({ message: "Configuration deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllConfigurations,
  getConfigurationById,
  updateNgrokUrl,
  createConfiguration,
  deleteConfiguration,
};
