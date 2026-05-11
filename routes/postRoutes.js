const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addPost } = require("../controllers/postController");
const router = express.Router();

router.post("/post/create", authMiddleware, addPost);

module.exports = router;
