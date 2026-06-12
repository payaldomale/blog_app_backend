const db = require("../config/db");

/* ---------------- CREATE POST ---------------- */
const createPost = async (
    author_id,
    title,
    slug,
    content,
    status,
    published_at
) => {
    const query = `
        INSERT INTO posts(
            author_id,
            title,
            slug,
            content,
            status,
            published_at
        )
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const result = await db.query(query, [
        author_id,
        title,
        slug,
        content,
        status,
        published_at
    ]);

    return result.rows[0];
};

/* ---------------- GET ALL POSTS (ACTIVE ONLY) ---------------- */
const getAllPosts = async () => {
    const query = `
        SELECT *
        FROM posts
        WHERE is_deleted = FALSE
    `;

    const result = await db.query(query);
    return result.rows;
};

/* ---------------- GET POST BY ID (IMPORTANT FIX) ---------------- */
const getPostById = async (postId) => {
    const query = `
        SELECT *
        FROM posts
        WHERE id = $1
        AND is_deleted = FALSE
    `;

    const result = await db.query(query, [postId]);
    return result.rows[0];
};

/* ---------------- UPDATE POST ---------------- */
const updatePost = async (id, title, content, status, published_at) => {
    const query = `
        UPDATE posts
        SET title = $1,
            content = $2,
            status = $3,
            published_at = $4,
            updated_at = NOW()
        WHERE id = $5
        AND is_deleted = FALSE
        RETURNING *;
    `;

    const values = [title, content, status, published_at, id];

    const result = await db.query(query, values);
    return result.rows[0];
};

/* ---------------- SOFT DELETE POST ---------------- */
const deletePost = async (id) => {
    const query = `
        UPDATE posts
        SET is_deleted = TRUE,
            deleted_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
        AND is_deleted = FALSE
        RETURNING *;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

/* ---------------- POSTS BY USER (ACTIVE ONLY) ---------------- */
const getPostsByUser = async (userId) => {
    const query = `
        SELECT id, title, content, status, published_at, like_count, comment_count
        FROM posts
        WHERE author_id = $1
        AND is_deleted = FALSE
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
};

/* ---------------- PUBLISH POST ---------------- */
const publishDraft = async (postId) => {
    const query = `
        UPDATE posts
        SET status = 'published',
            published_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
        AND is_deleted = FALSE
        RETURNING *;
    `;

    const result = await db.query(query, [postId]);
    return result.rows[0];
};

/* ---------------- PUBLISHED POSTS ---------------- */
const getPublishedPosts = async () => {
    const query = `
        SELECT id, title, content, author_id, published_at, like_count, comment_count
        FROM posts
        WHERE status = 'published'
        AND is_deleted = FALSE
        ORDER BY published_at DESC;
    `;

    const result = await db.query(query);
    return result.rows;
};

/* ---------------- SINGLE PUBLISHED POST ---------------- */
const getPublishedPostById = async (postId) => {
    const query = `
        SELECT *
        FROM posts
        WHERE id = $1
        AND status = 'published'
        AND is_deleted = FALSE;
    `;

    const result = await db.query(query, [postId]);
    return result.rows[0];
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsByUser,
    publishDraft,
    getPublishedPosts,
    getPublishedPostById
};