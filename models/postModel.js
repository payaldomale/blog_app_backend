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

module.exports = { createPost, getAllPosts, getPostById, updatePost };
