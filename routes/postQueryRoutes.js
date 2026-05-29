const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const { getPosts } = require("../controllers/postQueryController");

const router = express.Router();

module.exports = router;
