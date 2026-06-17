const { likePost, getLike, unlikePost } = require("../models/likeModel");
const { getPublishedPostById } = require("../models/postModel");

// LIKE
const addLike = async (req, res) => {
    try {
        const user_id = req.user.id;
        const post_id = Number(req.params.postId);

        const post = await getPublishedPostById(post_id);
        if (!post) {
            return res.status(403).json({
                message: "Cannot like draft or deleted post"
            });
        }

        const existingLike = await getLike(user_id, post_id);

        if (existingLike) {
            // 🔥 IMPORTANT: don't throw error, just return success
            return res.status(200).json({
                message: "Already liked",
                data: existingLike
            });
        }

        const like = await likePost(user_id, post_id);

        return res.status(201).json({
            message: "Liked successfully",
            data: like
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// UNLIKE
const removeLike = async (req, res) => {
    try {
        const user_id = req.user.id;
        const post_id = Number(req.params.postId);

        const post = await getPublishedPostById(post_id);
        if (!post) {
            return res.status(403).json({
                message: "Cannot unlike draft or deleted post"
            });
        }

        const existingLike = await getLike(user_id, post_id);

        if (!existingLike) {
            return res.status(200).json({
                message: "Already unliked"
            });
        }

        await unlikePost(user_id, post_id);

        return res.status(200).json({
            message: "Unliked successfully"
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const checkLikeStatus = async (req, res) => {
    try {
        const user_id = req.user.id;
        const post_id = req.params.postId;

        const like = await getLike(user_id, post_id);

        return res.status(200).json({
            liked: !!like
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

module.exports = { addLike, removeLike, checkLikeStatus };