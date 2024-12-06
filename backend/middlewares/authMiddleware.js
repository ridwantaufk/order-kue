const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Akses tidak diizinkan, token tidak ditemukan" });
  }

  try {
    console.log("process.env.JWT_SECRET : ", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid" });
  }
};

module.exports = authMiddleware;
