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

/* ---------------- GET ALL POSTS ---------------- */
const getAllPosts = async () => {
    const query = `
        SELECT
            p.*,
            (
                SELECT COUNT(*)
                FROM likes l
                WHERE l.post_id = p.id
            )::INT AS like_count
        FROM posts p
        WHERE p.is_deleted = FALSE
        ORDER BY p.created_at DESC;
    `;

    const result = await db.query(query);
    return result.rows;
};

/* ---------------- GET POST BY ID ---------------- */
const getPostById = async (postId) => {
    const query = `
        SELECT
            p.*,
            (
                SELECT COUNT(*)
                FROM likes l
                WHERE l.post_id = p.id
            )::INT AS like_count
        FROM posts p
        WHERE p.id = $1
        AND p.is_deleted = FALSE;
    `;

    const result = await db.query(query, [postId]);
    return result.rows[0];
};

/* ---------------- UPDATE POST ---------------- */
const updatePost = async (
    id,
    title,
    content,
    status,
    published_at
) => {
    const query = `
        UPDATE posts
        SET
            title = $1,
            content = $2,
            status = $3,
            published_at = $4,
            updated_at = NOW()
        WHERE id = $5
        AND is_deleted = FALSE
        RETURNING *;
    `;

    const values = [
        title,
        content,
        status,
        published_at,
        id
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

/* ---------------- DELETE POST ---------------- */
const deletePost = async (id) => {
    const query = `
        UPDATE posts
        SET
            is_deleted = TRUE,
            deleted_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
        AND is_deleted = FALSE
        RETURNING *;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

/* ---------------- POSTS BY USER ---------------- */
const getPostsByUser = async (userId) => {
    const query = `
        SELECT
            p.id,
            p.title,
            p.content,
            p.status,
            p.published_at,
            p.comment_count,
            (
                SELECT COUNT(*)
                FROM likes l
                WHERE l.post_id = p.id
            )::INT AS like_count
        FROM posts p
        WHERE p.author_id = $1
        AND p.is_deleted = FALSE
        ORDER BY p.id DESC;
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
};

/* ---------------- PUBLISH POST ---------------- */
const publishDraft = async (postId) => {
    const query = `
        UPDATE posts
        SET
            status = 'published',
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
        SELECT
            p.id,
            p.title,
            p.content,
            p.author_id,
            p.published_at,
            p.comment_count,
            (
                SELECT COUNT(*)
                FROM likes l
                WHERE l.post_id = p.id
            )::INT AS like_count
        FROM posts p
        WHERE p.status = 'published'
        AND p.is_deleted = FALSE
        ORDER BY p.published_at DESC;
    `;

    const result = await db.query(query);
    return result.rows;
};

/* ---------------- SINGLE PUBLISHED POST ---------------- */
const getPublishedPostById = async (postId) => {
    const query = `
        SELECT
            p.*,
            (
                SELECT COUNT(*)
                FROM likes l
                WHERE l.post_id = p.id
            )::INT AS like_count
        FROM posts p
        WHERE p.id = $1
        AND p.status = 'published'
        AND p.is_deleted = FALSE;
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