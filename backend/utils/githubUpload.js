const axios = require("axios");
const fs = require("fs");

// Fungsi untuk meng-upload gambar ke GitHub
async function uploadToGitHub(filePath, filename) {
  const token = "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"; // Token GitHub Anda
  const repoOwner = "ridwantaufk"; // Nama pengguna GitHub
  const repoName = "order-kue"; // Nama repo
  const branchName = "master"; // Nama cabang (branch) tempat gambar akan di-upload

  // Baca file gambar
  const file = fs.readFileSync(filePath);
  const encodedContent = file.toString("base64"); // Encode file menjadi base64

  // Persiapkan payload untuk GitHub API
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/frontend/public/assets/img/products/${filename}`;
  const data = {
    message: `Add ${filename}`,
    content: encodedContent, // Isi file gambar dalam bentuk base64
    branch: branchName,
  };

  // Membuat permintaan PUT untuk upload gambar
  try {
    const response = await axios.put(apiUrl, data, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    console.log("File uploaded successfully:", response.data);
    return response.data.content.download_url; // URL gambar yang di-upload
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

module.exports = { uploadToGitHub };
