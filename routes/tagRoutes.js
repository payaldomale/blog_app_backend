const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const { createTagController, attachTag, filterPostsByTag } = require("../controllers/tagController");

const router = express.Router();

router.post("/tag/create", authMiddleware, createTagController);

router.post("/tag/attach", authMiddleware, attachTag);

router.get("/tag/:tagId/posts", filterPostsByTag);

module.exports = router;
