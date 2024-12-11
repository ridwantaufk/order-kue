const express = require("express");
const { recordVisitor } = require("../controllers/visitorController");
const router = express.Router();

router.post("/visitors", recordVisitor);

module.exports = router;
