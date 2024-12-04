const axios = require("axios");
const fs = require("fs");

// Konstanta untuk konfigurasi GitHub
const GITHUB_CONFIG = {
  token: process.env.GITHUB_TOKEN,
  repoOwner: process.env.GITHUB_REPO_OWNER,
  repoName: process.env.GITHUB_REPO_NAME,
  branchName: process.env.GITHUB_BRANCH_NAME,
};

// Fungsi untuk meng-upload gambar ke GitHub
async function uploadToGitHub(file, filename) {
  try {
    const encodedContent = file.buffer.toString("base64");

    // URL API GitHub
    const apiUrl = `https://api.github.com/repos/${GITHUB_CONFIG.repoOwner}/${GITHUB_CONFIG.repoName}/contents/frontend/public/assets/img/products/${filename}`;

    // Payload untuk permintaan API
    const data = {
      message: `Add ${filename}`,
      content: encodedContent, // Isi file gambar dalam bentuk base64
      branch: GITHUB_CONFIG.branchName,
    };

    // Membuat permintaan PUT untuk upload gambar
    const response = await axios.put(apiUrl, data, {
      headers: {
        Authorization: `token ${GITHUB_CONFIG.token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    console.log("Icon berhasil diupload:", response.data.content.download_url);

    // URL gambar yang di-upload
    return response.data.content.download_url;
  } catch (error) {
    console.error(
      "Error mengupload icon:",
      error.response?.data || error.message
    );
    throw new Error("Gagal upload icon ke GitHub");
  }
}

async function deleteFileFromGitHub(filePath) {
  try {
    // API GitHub
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.repoOwner}/${GITHUB_CONFIG.repoName}/contents/${filePath}`;
    console.log("url hapus: ", url);

    // ngambil SHA pake methode GET
    const shaResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_CONFIG.token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    console.log("shaResponse : ", shaResponse);
    const sha = shaResponse.data.sha;
    console.log("shaResponse data shae : ", shaResponse.data.sha);

    const deleteData = {
      message: `Delete ${filePath}`,
      sha,
      branch: GITHUB_CONFIG.branchName,
    };

    console.log("deleteData : ", deleteData);
    const deleteResponse = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_CONFIG.token}`,
        Accept: "application/vnd.github.v3+json",
      },
      data: deleteData,
    });

    console.log(`File ${filePath} berhasil dihapus.`);
    return deleteResponse.data;
  } catch (error) {
    console.error(
      "Error menghapus icon di GitHub:",
      error.response?.data || error.message
    );
    throw new Error("Gagal menghapus icon di GitHub");
  }
}

module.exports = { uploadToGitHub, deleteFileFromGitHub };
