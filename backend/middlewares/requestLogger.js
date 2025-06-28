const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "../logs/request-logs.txt");
const summaryPath = path.join(__dirname, "../logs/bandwidth-summary.jsonl"); // gunakan JSONL (JSON Lines)

const requestLogger = (req, res, next) => {
  const start = Date.now();
  let reqLength = 0;

  req.on("data", (chunk) => {
    reqLength += chunk.length;
  });

  res.on("finish", () => {
    const duration = Date.now() - start;
    const resLength = parseInt(res.get("Content-Length")) || 0;
    const total = reqLength + resLength;

    const logEntry = {
      time: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      reqLength,
      resLength,
      total,
      duration,
    };

    const logText = `[${logEntry.time}] ${logEntry.method} ${logEntry.url} ${logEntry.status} - ${logEntry.duration}ms - req: ${reqLength} bytes, res: ${resLength} bytes, total: ${total} bytes\n`;

    try {
      fs.appendFileSync(logPath, logText);
    } catch (err) {
      console.error("Error writing log:", err);
    }

    // Baca file log dan hitung total bandwidth dari semua log
    let totalBytes = 0;
    try {
      const allLogs = fs.readFileSync(logPath, "utf-8");
      totalBytes = allLogs
        .split("\n")
        .filter((line) => line.includes("total:"))
        .map((line) => {
          const match = line.match(/total:\s+(\d+)\s+bytes/);
          return match ? parseInt(match[1]) : 0;
        })
        .reduce((acc, curr) => acc + curr, 0);
    } catch (err) {
      console.error("Failed to calculate bandwidth:", err);
    }

    // Tambahkan log JSON ke file summary (dalam bentuk JSON lines)
    const jsonLine =
      JSON.stringify({ ...logEntry, totalBandwidth: totalBytes }) + "\n";

    try {
      fs.appendFileSync(summaryPath, jsonLine);
    } catch (err) {
      console.error("Failed to append summary JSONL:", err);
    }

    // Tambah juga info total bandwidth ke .txt log
    try {
      fs.appendFileSync(
        logPath,
        `Total Bandwidth So Far: ${totalBytes} bytes\n`
      );
    } catch (err) {
      console.error("Failed to append total bandwidth to txt log:", err);
    }
  });

  next();
};

module.exports = requestLogger;
