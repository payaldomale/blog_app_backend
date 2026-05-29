const db = require("../config/db");

// create tag
const createTag = async (name) => {

    const query = `
        INSERT INTO tags (name)
        VALUES ($1)
        RETURNING *;
    `;

    const result = await db.query(query, [name]);
    return result.rows[0];
};

// get tag by name
const getTagByName = async (name) => {

    const query = `
        SELECT *
        FROM tags
        WHERE name = $1;
    `;

    const result = await db.query(query, [name]);
    return result.rows[0];
};

// attach tag to post
const attachTagToPost = async (post_id, tag_id) => {

    const query = `
        INSERT INTO post_tags (post_id, tag_id)
        VALUES ($1, $2)
        RETURNING *;
    `;

    const result = await db.query(query, [post_id, tag_id]);
    return result.rows[0];
};

// get posts by tag
const getPostsByTag = async (tag_id) => {

    const query = `
        SELECT p.*
        FROM posts p
        JOIN post_tags pt ON p.id = pt.post_id
        WHERE pt.tag_id = $1
        AND p.status = 'published'
        AND p.is_deleted = FALSE
        ORDER BY p.published_at DESC;
    `;

    const result = await db.query(query, [tag_id]);
    return result.rows;
};

module.exports = { createTag, getTagByName, attachTagToPost, getPostsByTag };
