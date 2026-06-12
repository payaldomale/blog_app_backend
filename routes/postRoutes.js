const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
    addPost,
    fetchAllPosts,
    fetchPostById,
    updatePostById,
    removePost,
    fetchPostsByUser,
    publishPost,
    fetchPublishedPosts
} = require("../controllers/postController");

const router = express.Router();

/* ---------------- POSTS ---------------- */

// Create post
router.post("/post/create", authMiddleware, addPost);

// Get all posts (admin/internal)
router.get("/post/getAllPosts", authMiddleware, fetchAllPosts);

// Get single post
router.get("/post/getPostById/:id", authMiddleware, fetchPostById);

// Update post
router.put("/post/updatePost/:id", authMiddleware, updatePostById);

// Delete post (soft delete)
router.delete("/post/removePost/:id", authMiddleware, removePost);

// Get posts by user
router.get("/post/getPostsByUser/:id", authMiddleware, fetchPostsByUser);

// Publish post
router.put("/post/publish/:id", authMiddleware, publishPost);

/* ---------------- PUBLIC ---------------- */

// Public feed (IMPORTANT FIX)
router.get("/post/published", fetchPublishedPosts);

module.exports = router;