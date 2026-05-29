const db = require("../config/db");

const likePost = async (user_id, post_id) => {

    const query = `
        INSERT INTO likes (user_id, post_id)
        VALUES ($1, $2)
        RETURNING *;
    `;

    const result = await db.query(query, [user_id, post_id]);

    // increment like count
    const updateQuery = `
        UPDATE posts
        SET like_count = like_count + 1
        WHERE id = $1;
    `;

    await db.query(updateQuery, [post_id]);

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

const unlikePost = async (user_id, post_id) => {

    const query = `
        DELETE FROM likes
        WHERE user_id = $1
        AND post_id = $2
        RETURNING *;
    `;

    const result = await db.query(query, [user_id, post_id]);

    if (result.rows.length > 0) {

        const updateQuery = `
            UPDATE posts
            SET like_count = GREATEST(like_count - 1, 0)
            WHERE id = $1;
        `;

        await db.query(updateQuery, [post_id]);
    }

    return result.rows[0];
};

module.exports = { likePost, getLike, unlikePost };
