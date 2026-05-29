const { createPost, getAllPosts, getPostById, updatePost, deletePost, getPostsByUser, publishDraft, getPublishedPosts } = require("../models/postModel");
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

        const filtered = result.filter(p => !p.is_deleted);

        return res.status(200).json({
            posts: filtered
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const fetchPostById = async (req, res) => {

    try {

        const id = req.params.id;

        const post = await getPostById(id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.is_deleted) {
            return res.status(404).json({
                message: "Post is deleted"
            });
        }

        return res.status(200).json({
            post
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const updatePostById = async (req, res) => {

    try {

        const id = req.params.id;
        const { title, content, status } = req.body;

        const post = await getPostById(id);

        if (!post || post.is_deleted) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.author_id !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized"
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

        return res.status(200).json({
            message: "Updated successfully",
            data: updatedPost
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const removePost = async (req, res) => {

    try {

        const id = req.params.id;

        const post = await getPostById(id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.author_id !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        const deleted = await deletePost(id);

        if (!deleted) {
            return res.status(400).json({
                message: "Already deleted"
            });
        }

        return res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const fetchPostsByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            res.status(400).json({
                message: "userId is required",
                status_code: 400
            })
        }
        const posts = await getPostsByUser(userId);
        return res.status(200).json({
            message: "Posts by user fetched successfully",
            status_code: 200,
            data: posts
        })
    }
    catch (err) {
        console.log("error:", err);
        res.status(500).json({
            message: "something went wrong",
            status_code: 500,
            error: err
        })
    }
}
const publishPost = async (req, res) => {

    try {

        const id = req.params.id;

        const post = await getPostById(id);

        if (!post || post.is_deleted) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.author_id !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        if (post.status === "published") {
            return res.status(400).json({
                message: "Already published"
            });
        }

        const publishedPost = await publishDraft(id);

        return res.status(200).json({
            message: "Published successfully",
            data: publishedPost
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const fetchPublishedPosts = async (req, res) => {
    try {

        const posts = await getPublishedPosts();

        return res.status(200).json({
            message: "Published posts fetched successfully",
            status_code: 200,
            data: posts
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

module.exports = { addPost, fetchAllPosts, fetchPostById, updatePostById, removePost, fetchPostsByUser, publishPost, fetchPublishedPosts };
