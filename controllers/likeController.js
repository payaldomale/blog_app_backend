const { likePost, getLike, unlikePost } = require("../models/likeModel");

const addLike = async (req, res) => {

    try {

        const user_id = req.user.id;

        const post_id = req.params.postId;

        if (!post_id) {
            return res.status(400).json({
                message: "post_id is required",
                status_code: 400
            });
        }

        // check if already liked
        const existingLike = await getLike(
            user_id,
            post_id
        );

        if (existingLike) {
            return res.status(400).json({
                message: "Post already liked",
                status_code: 400
            });
        }

        // add like + increment count
        const like = await likePost(
            user_id,
            post_id
        );

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

const removeLike = async (req, res) => {

    try {

        const user_id = req.user.id;

        const post_id = req.params.postId;

        if (!post_id) {
            return res.status(400).json({
                message: "post_id is required",
                status_code: 400
            });
        }

        // check if like exists
        const existingLike = await getLike(
            user_id,
            post_id
        );

        if (!existingLike) {
            return res.status(404).json({
                message: "Like not found",
                status_code: 404
            });
        }

        await unlikePost(
            user_id,
            post_id
        );

        return res.status(200).json({
            message: "Post unliked successfully",
            status_code: 200
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

module.exports = { addLike, removeLike };
