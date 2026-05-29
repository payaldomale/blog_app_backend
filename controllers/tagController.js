const { createTag, getTagByName, attachTagToPost, getPostsByTag } = require("../models/tagModel");

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

const attachTag = async (req, res) => {

    try {

        const { post_id, tag_id } = req.body;

        // ❌ block draft/deleted posts
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

const filterPostsByTag = async (req, res) => {

    try {

        const tag_id = req.params.tagId;

        const posts = await getPostsByTag(tag_id);

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

module.exports = { createTagController, attachTag, filterPostsByTag };
