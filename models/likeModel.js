const db = require("../config/db");

const likePost = async (user_id, post_id) => {

    const query = `
        INSERT INTO likes (user_id, post_id)
        VALUES ($1, $2)
        RETURNING *;
    `;

    const result = await db.query(query, [user_id, post_id]);

    return result.rows[0];
};

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

module.exports = { likePost, getLike };
