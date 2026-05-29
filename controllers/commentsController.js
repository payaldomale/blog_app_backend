const { createComment, getCommentsByPost, updateComment, getCommentById, deleteComment } = require("../models/commentsModel");
const { getPublishedPostById } = require("../models/postModel");

const addComment = async (req, res) => {

    try {

        const { post_id, content } = req.body;

        const post = await getPublishedPostById(post_id);

        if (!post) {
            return res.status(403).json({
                message: "Cannot comment on draft or deleted post"
            });
        }

        const comment = await createComment(
            post_id,
            req.user.id,
            content
        );

        return res.status(201).json({
            message: "Comment added",
            data: comment
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
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

        const comment = await getCommentById(id);

        if (!comment || comment.is_deleted) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comment.author_id !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        const updated = await updateComment(id, content);

        return res.status(200).json({
            message: "Comment updated",
            data: updated
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });
    }
};

const removeComment = async (req, res) => {

    try {

        const id = req.params.id;

        const comment = await getCommentById(id);

        if (!comment || comment.is_deleted) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comment.author_id !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        const deleted = await deleteComment(id, comment.post_id);

        return res.status(200).json({
            message: "Comment deleted",
            data: deleted
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });
    }
};

module.exports = { addComment, getComments, editComment, removeComment };
