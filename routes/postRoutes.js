const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addPost, fetchAllPosts, fetchPostById } = require("../controllers/postController");
const router = express.Router();

router.post("/post/create", authMiddleware, addPost);
router.get("/post/getAllPosts", authMiddleware, fetchAllPosts);
router.get("/post/getPostbyId/:id", authMiddleware, fetchPostById);

module.exports = router;
