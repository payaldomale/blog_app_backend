const { createPost, getAllPosts, getPostById, updatePost, deletePost, getPostsByUser } = require("../models/postModel");
const { generateSlug } = require("../utils/slugify");

const addPost = async (req, res) => {
    try {
        const { title, content, status } = req.body;

        const slug = generateSlug(title);

        const published_at =
            status === "published" ? new Date() : null;

        const posts = await createPost(
            req.user.id,
            title,
            slug,
            content,
            status,
            published_at,
        );
        res.status(201).json(
            {
                message: "post successfully created",
                data: posts,
                status_code: 201
            }
        )
    }
    catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err,
            status_code: 500
        })
        console.log("error:", err)
    }
}

const fetchAllPosts = async (req, res) => {
    try {
        const result = await getAllPosts();
        res.status(200).json({
            posts: result,
            status_code: 200
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            status_code: 500
        })
        console.log("error:", err);
    }
}

const fetchPostById = async (req, res) => {
    const userId = req.params.id;
    const post = await getPostById(userId);
    if (!post) {
        return res.status(404).json({
            message: "Post not found",
            status_code: 404
        });
    }
    if (post.is_deleted === true) {
        res.status(404).json({
            message: "cannot fetch deleted post",
            status_code: 404
        })
    }
    res.status(200).json({
        post: post,
        status_code: 200
    })
}

const updatePostById = async (req, res) => {
    try {

        const id = req.params.id;

        const { title, content, status } = req.body;

        const post = await getPostById(id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                status_code: 404
            });
        }

        if (post.is_deleted === true) {
            res.status(404).json({
                message: "cannot update deleted post",
                status_code: 404
            })
        }

        if (post.author_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const published_at =
            status === "published"
                ? post.published_at || new Date()
                : null;

        const updatedPost = await updatePost(
            id,
            title,
            content,
            status,
            published_at
        );

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost,
        });

    } catch (err) {

        console.log("error:", err);

        res.status(500).json({
            message: err.message,
            status_code: 500
        });
    }
};

const removePost = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(404).json({
                message: "id not found",
                id,
                status_code: 404
            })
        }
        const rmvpost = await deletePost(id);

        if (!rmvpost) {
            res.status(404).json({
                message: "post not found",
                id,
                status_code: 404
            })
        }

        if (rmvpost.is_deleted === true) {
            res.status(404).json({
                message: "Already deleted",
                status_code: 404
            })
        }

        res.status(200).json({
            message: "post successfully deleted",
            id,
            status_code: 200
        })

    }
    catch (err) {
        console.log("error:", err);
        res.status(500).json({
            message: err.message,
            status_code: 500
        })
    }
}



module.exports = { addPost, fetchAllPosts, fetchPostById, updatePostById, removePost };
