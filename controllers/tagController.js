const {
    createTag,
    getTagByName,
    attachTagToPost,
    getPostsByTag,
    getTagsByPost,
    getAllTags
} = require("../models/tagModel");

const { getPostById } = require("../models/postModel");

// create tag
const createTagController = async (req, res) => {
    try {
        const { name } = req.body;

        const existing = await getTagByName(name);

        if (existing) {
            return res.status(400).json({
                message: "Tag already exists"
            });
        }

        const tag = await createTag(name);

        return res.status(201).json({
            message: "Tag created",
            data: tag
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// attach tag to post
const attachTag = async (req, res) => {
    try {
        console.log("BODY:", req.body);

        const { post_id, tag_id } = req.body;

        const post = await getPostById(post_id);

        if (!post || post.is_deleted) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.status !== "published") {
            return res.status(403).json({
                message: "Cannot tag draft post"
            });
        }

        const result = await attachTagToPost(post_id, tag_id);

        return res.status(201).json({
            message: "Tag attached",
            data: result
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// get posts by tag
const filterPostsByTag = async (req, res) => {
    try {
        const { tagId } = req.params;

        const posts = await getPostsByTag(tagId);

        return res.status(200).json({
            message: "Posts fetched",
            data: posts
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// get tags by post
const getTagsByPostController = async (req, res) => {
    try {
        const { postId } = req.params;

        const tags = await getTagsByPost(postId);

        return res.status(200).json({
            data: tags
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// get all tags
const getAllTagsController = async (req, res) => {
    try {
        const tags = await getAllTags();

        return res.status(200).json({
            data: tags
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    createTagController,
    attachTag,
    filterPostsByTag,
    getTagsByPostController,
    getAllTagsController
};