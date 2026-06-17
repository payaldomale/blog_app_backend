const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
    createTagController,
    attachTag,
    filterPostsByTag,
    getTagsByPostController,
    getAllTagsController
} = require("../controllers/tagController");

const router = express.Router();

// create tag
router.post("/tag/create", authMiddleware, createTagController);

// attach tag to post
router.post("/tag/attach", authMiddleware, attachTag);

// get all tags (FOR TagSelector)
router.get("/tag/all", getAllTagsController);

// get posts by tag
router.get("/tag/:tagId/posts", filterPostsByTag);

// get tags by post
router.get("/post/:postId/tags", getTagsByPostController);

module.exports = router;