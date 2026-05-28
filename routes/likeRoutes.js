const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { addLike } = require("../controllers/likeController");

const router = express.Router();

router.post("/like/:postId", authMiddleware, addLike);

module.exports = router;
