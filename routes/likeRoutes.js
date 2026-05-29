const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { addLike, removeLike } = require("../controllers/likeController");

const router = express.Router();

router.post("/like/:postId", authMiddleware, addLike);
router.delete("/unlike/:postId", authMiddleware, removeLike);

module.exports = router;
