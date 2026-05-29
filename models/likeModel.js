const db = require("../config/db");

const likePost = async (user_id, post_id) => {

    // insert like
    const likeQuery = `
        INSERT INTO likes (user_id, post_id)
        VALUES ($1, $2)
        RETURNING *;
    `;

    const likeResult = await db.query(
        likeQuery,
        [user_id, post_id]
    );

    // increment like_count
    const updateQuery = `
        UPDATE posts
        SET like_count = like_count + 1
        WHERE id = $1;
    `;

    await db.query(updateQuery, [post_id]);

    return likeResult.rows[0];
};

const getLike = async (user_id, post_id) => {

    const query = `
        SELECT *
        FROM likes
        WHERE user_id = $1
        AND post_id = $2;
    `;

    const result = await db.query(
        query,
        [user_id, post_id]
    );

    return result.rows[0];
};

const unlikePost = async (user_id, post_id) => {

    // delete like
    const deleteQuery = `
        DELETE FROM likes
        WHERE user_id = $1
        AND post_id = $2
        RETURNING *;
    `;

    const deleteResult = await db.query(
        deleteQuery,
        [user_id, post_id]
    );

    // decrement like_count
    const updateQuery = `
        UPDATE posts
        SET like_count = GREATEST(like_count - 1, 0)
        WHERE id = $1;
    `;

    await db.query(updateQuery, [post_id]);

    return deleteResult.rows[0];
};

module.exports = { likePost, getLike, unlikePost };
