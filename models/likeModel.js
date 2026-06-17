const db = require("../config/db");

// ADD LIKE
const likePost = async (user_id, post_id) => {
    const query = `
        INSERT INTO likes (user_id, post_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, post_id) DO NOTHING
        RETURNING *;
    `;

    const result = await db.query(query, [user_id, post_id]);

    return result.rows[0];
};

// CHECK LIKE
const getLike = async (user_id, post_id) => {
    const query = `
        SELECT *
        FROM likes
        WHERE user_id = $1
        AND post_id = $2;
    `;

    const result = await db.query(query, [user_id, post_id]);

    return result.rows[0];
};

// REMOVE LIKE
const unlikePost = async (user_id, post_id) => {
    const query = `
        DELETE FROM likes
        WHERE user_id = $1
        AND post_id = $2
        RETURNING *;
    `;

    const result = await db.query(query, [user_id, post_id]);

    return result.rows[0];
};

module.exports = {
    likePost,
    getLike,
    unlikePost
};