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

module.exports = { createPost };