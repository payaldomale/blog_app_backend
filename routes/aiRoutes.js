const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createTitle, createSummary } = require("../controllers/aiController");

router.post("/ai/generate-title", authMiddleware, createTitle);
router.post("/ai/generate-summary", authMiddleware, createSummary);

module.exports = router;