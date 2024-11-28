// GUNAKAN FILE INI DI TERMINAL DENGAN COMMAND 'node hashPassword.js' JIKA INGIN UPDATE PASSWORD YG BELUM DIHASH !

// const bcrypt = require("bcrypt");
// const User = require("./models/userModel"); // Sesuaikan path model Anda

// (async () => {
//   const usersToUpdate = [
//     { id: 3, newPassword: "admin" },
//     { id: 4, newPassword: "admin" },
//     { id: 5, newPassword: "admin" },
//   ];

//   try {
//     const updatePromises = usersToUpdate.map(async (user) => {
//       const hashedPassword = await bcrypt.hash(user.newPassword, 10); // Enkripsi password baru
//       const userRecord = await User.findByPk(user.id); // Ambil user berdasarkan ID
//       if (userRecord) {
//         await userRecord.update({ password: hashedPassword }); // Perbarui password di database
//         console.log(`Password untuk user ID ${user.id} berhasil diperbarui.`);
//       } else {
//         console.log(`User dengan ID ${user.id} tidak ditemukan.`);
//       }
//     });

//     await Promise.all(updatePromises); // Menunggu semua proses update selesai
//     console.log("Semua password berhasil diperbarui.");
//   } catch (err) {
//     console.error("Terjadi kesalahan:", err.message);
//   }
// })();

// =====================================================================================
// CEK KECOCOKAN :

// const bcrypt = require("bcrypt");

// const password = "admin"; // Password asli
// const hashedPassword =
//   "$2b$10$3ytMfnoUz7xmgVJdBjK3tOihTUGzJAIbZ6MFiQOUgz80z9Iy1UWIW";

// bcrypt.compare(password, hashedPassword, (err, result) => {
//   if (result) {
//     console.log("Password cocok!");
//   } else {
//     console.log("Password tidak cocok!");
//   }
// });
