const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { addLike, removeLike, checkLikeStatus } = require("../controllers/likeController");

const router = express.Router();

router.post("/like/:postId", authMiddleware, addLike);
router.delete("/unlike/:postId", authMiddleware, removeLike);
router.get("/like-status/:postId", authMiddleware, checkLikeStatus);

module.exports = router;
