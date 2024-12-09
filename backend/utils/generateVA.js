const generateVA = (bankCode = "BCA") => {
  const prefix = bankCode === "BCA" ? "1234" : "0000"; // Simulasi prefix VA untuk BCA
  const uniquePart = Math.floor(100000000 + Math.random() * 900000000); // Random 9 digit
  return `${prefix}${uniquePart}`;
};

const generateOrderID = () => {
  return `ORDER-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

module.exports = { generateVA, generateOrderID };
