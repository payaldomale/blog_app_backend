const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addPost, fetchAllPosts, fetchPostById, updatePostById, removePost, fetchPostsByUser, publishPost } = require("../controllers/postController");
const router = express.Router();

router.post("/post/create", authMiddleware, addPost);
router.get("/post/getAllPosts", authMiddleware, fetchAllPosts);
router.get("/post/getPostbyId/:id", authMiddleware, fetchPostById);
router.put("/post/updatePost/:id", authMiddleware, updatePostById);
router.put("/post/removePost/:id", authMiddleware, removePost);
router.get("/post/getPostsByUser/:id", authMiddleware, fetchPostsByUser);
router.put("/post/publish/:id", authMiddleware, publishPost);

module.exports = router;
