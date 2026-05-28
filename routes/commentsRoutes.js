const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addComment, getComments, editComment, removeComment } = require("../controllers/commentsController");

const router = express.Router();

router.post("/comment/create", authMiddleware, addComment);
router.get("/comment/post/:id", getComments);
router.put("/comment/:id", authMiddleware, editComment);
router.put("/delete/comment/:id", authMiddleware, removeComment);

module.exports = router;
