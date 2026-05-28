const { likePost, getLike } = require("../models/likeModel");

const addLike = async (req, res) => {
    try {

        const user_id = req.user.id;

        const post_id = req.params.postId; // ✅ THIS IS THE KEY FIX

        if (!post_id) {
            return res.status(400).json({
                message: "post_id is required",
                status_code: 400
            });
        }

        const existingLike = await getLike(user_id, post_id);

        if (existingLike) {
            return res.status(400).json({
                message: "Post already liked",
                status_code: 400
            });
        }

        const like = await likePost(user_id, post_id);

        return res.status(201).json({
            message: "Post liked successfully",
            status_code: 201,
            data: like
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong",
            status_code: 500,
            error: err.message
        });
    }
};

module.exports = { addLike };
