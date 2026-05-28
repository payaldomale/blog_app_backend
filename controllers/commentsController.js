const { createComment, getCommentsByPost, updateComment, getCommentById, deleteComment } = require("../models/commentsModel");

const addComment = async (req, res) => {
    try {
        const { post_id, content } = req.body;

        if (!post_id || !content) {
            return res.status(400).json({
                message: "post_id and content are required",
                status_code: 400
            });
        }

        const comment = await createComment(
            post_id,
            req.user.id,
            content
        );

        return res.status(201).json({
            message: "Comment created successfully",
            status_code: 201,
            data: comment
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

const getComments = async (req, res) => {
    try {
        const post_id = req.params.postId;

        const comments = await getCommentsByPost(post_id);

        return res.status(200).json({
            message: "Comments fetched successfully",
            status_code: 200,
            data: comments
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

const editComment = async (req, res) => {
    try {
        const id = req.params.id;
        const { content } = req.body;

        const comment = await updateComment(id, content);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
                status_code: 404
            });
        }

        if (comment.author_id !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized",
                status_code: 403
            });
        }

        return res.status(200).json({
            message: "Comment updated successfully",
            status_code: 200,
            data: comment
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

const removeComment = async (req, res) => {

    try {

        const id = req.params.id;

        const comment = await getCommentById(id);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
                status_code: 404
            });
        }

        if (comment.author_id !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized",
                status_code: 403
            });
        }

        if (comment.is_deleted) {
            return res.status(400).json({
                message: "Comment already deleted",
                status_code: 400
            });
        }

        const deletedComment = await deleteComment(id);

        return res.status(200).json({
            message: "Comment deleted successfully",
            status_code: 200,
            data: deletedComment
        });

    } catch (err) {

        console.log("error:", err);

        return res.status(500).json({
            message: "Something went wrong",
            status_code: 500,
            error: err.message
        });
    }
};

module.exports = { addComment, getComments, editComment, removeComment };
