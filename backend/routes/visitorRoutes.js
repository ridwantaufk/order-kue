const express = require("express");
const {
  recordVisitor,
  getVisitorStats,
  getDailyVisitors,
} = require("../controllers/visitorController");
const router = express.Router();

router.get("/visitors/stats", getVisitorStats);
router.get("/visitors/daily", getDailyVisitors);
router.post("/visitors", recordVisitor);

module.exports = router;
