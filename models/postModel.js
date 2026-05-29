const db = require("../config/db");

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

const getAllPosts = async () => {
    const query = `SELECT * FROM posts`;
    const result = await db.query(query);
    return result.rows;
}

const getPostById = async (postId) => {
    const query = `SELECT * FROM posts WHERE id=$1`;
    const result = await db.query(query, [postId]);
    return result.rows[0];
}

const updatePost = async (id, title, content, status, published_at) => {
    const query = `UPDATE posts SET title = $1, content = $2, status = $3, published_at = $4, updated_at = NOW() WHERE id = $5 RETURNING *`;

    const values = [
        title,
        content,
        status,
        published_at,
        id
    ];

    const result = await db.query(query, values);

    return result.rows[0];
}

const deletePost = async (id) => {
    // const query = `DELETE FROM posts WHERE id=$1`;
    const query = `UPDATE posts SET is_deleted = TRUE, deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND is_deleted = FALSE RETURNING *`;
    const result = await db.query(query, [id]);
    return result.rows[0];
}

const getPostsByUser = async (userId) => {
    const query = `SELECT  id, title, content, status, published_at, like_count, comment_count FROM posts WHERE author_id=$1`;
    const result = await db.query(query, [userId]);
    return result.rows;
}

const publishDraft = async (postId) => {

    const query = `
        UPDATE posts
        SET status = 'published',
            published_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `;

    const result = await db.query(query, [postId]);
    return result.rows[0];
};

const getPublishedPosts = async () => {
    const query = `
        SELECT id, title, content, author_id, published_at, like_count, comment_count
        FROM posts
        WHERE status = 'published'
        ORDER BY published_at DESC;
    `;

    const result = await db.query(query);
    return result.rows;
};

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

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost, getPostsByUser, publishDraft, getPublishedPosts, getPublishedPostById };
