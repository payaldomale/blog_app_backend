const db = require("../config/db");

const createComment = async (post_id, author_id, content) => {
    const query = `
        INSERT INTO comments (post_id, author_id, content)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const result = await db.query(query, [post_id, author_id, content]);
    return result.rows[0];
};

const getCommentsByPost = async (post_id) => {
    const query = `
        SELECT *
        FROM comments
        WHERE post_id = $1
        ORDER BY created_at ASC;
    `;

    const result = await db.query(query, [post_id]);
    return result.rows;
};

const updateComment = async (id, content) => {
    const query = `
        UPDATE comments
        SET content = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *;
    `;

    const result = await db.query(query, [content, id]);
    return result.rows[0];
};

const getCommentById = async (id) => {

    const query = `
        SELECT *
        FROM comments
        WHERE id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};

const deleteComment = async (id) => {

    const query = `
        UPDATE comments
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

module.exports = { createComment, getCommentsByPost, updateComment, getCommentById, deleteComment };
