const express = require("express");
const {
  recordVisitor,
  getVisitorStats,
  getDailyVisitors,
  getVisitorInsights,
  getRecentVisitors,
} = require("../controllers/visitorController");
const router = express.Router();

router.get("/visitors/stats", getVisitorStats);
router.get("/visitors/daily", getDailyVisitors);
router.get("/visitors/insights", getVisitorInsights);
router.get("/visitors/recent", getRecentVisitors);
router.post("/visitors", recordVisitor);

module.exports = router;
