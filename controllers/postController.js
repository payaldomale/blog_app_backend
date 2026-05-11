const { createPost, getAllPosts, getPostById, updatePost } = require("../models/postModel");
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
    res.status(200).json({
        post: post,
        status_code: 200
    })
}

const updatePostById = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, content, status } = req.body;

        const post = await updatePost(id);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
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
                ? existingPost.published_at || new Date()
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
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            status_code: 500
        })
        console.log("error:", err);
    }
}

module.exports = { addPost, fetchAllPosts, fetchPostById, updatePostById };
