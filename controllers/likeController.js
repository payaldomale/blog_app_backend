const { likePost, getLike, unlikePost } = require("../models/likeModel");
const { getPublishedPostById } = require("../models/postModel");

const addLike = async (req, res) => {

    try {

        const user_id = req.user.id;
        const post_id = req.params.postId;

        // ❌ BLOCK DRAFT POSTS
        const post = await getPublishedPostById(post_id);

        if (!post) {
            return res.status(403).json({
                message: "Cannot like draft or deleted post"
            });
        }

        // ❌ prevent duplicate like
        const existingLike = await getLike(user_id, post_id);

        if (existingLike) {
            return res.status(400).json({
                message: "Already liked"
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

const removeLike = async (req, res) => {

    try {

        const user_id = req.user.id;
        const post_id = req.params.postId;

        const post = await getPublishedPostById(post_id);

        if (!post) {
            return res.status(403).json({
                message: "Cannot unlike draft or deleted post"
            });
        }

        const existingLike = await getLike(user_id, post_id);

        if (!existingLike) {
            return res.status(404).json({
                message: "Like not found"
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

module.exports = { addLike, removeLike };
