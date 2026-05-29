const db = require("../config/db");

const getPostsQuery = async ({
    limit,
    offset,
    sortBy,
    order,
    status,
    userId
}) => {

    let baseQuery = `
        SELECT *
        FROM posts
        WHERE is_deleted = FALSE
    `;

    const values = [];
    let index = 1;

    // FILTER: status
    if (status) {
        baseQuery += ` AND status = $${index}`;
        values.push(status);
        index++;
    }

    // FILTER: user
    if (userId) {
        baseQuery += ` AND author_id = $${index}`;
        values.push(userId);
        index++;
    }

    // SORTING (safe whitelist)
    const allowedSort = ["created_at", "like_count", "comment_count", "published_at"];
    const safeSortBy = allowedSort.includes(sortBy) ? sortBy : "created_at";

    const safeOrder = order === "ASC" ? "ASC" : "DESC";

    baseQuery += ` ORDER BY ${safeSortBy} ${safeOrder}`;

    // PAGINATION
    baseQuery += ` LIMIT $${index} OFFSET $${index + 1}`;
    values.push(limit, offset);

    const result = await db.query(baseQuery, values);
    return result.rows;
};

module.exports = { getPostsQuery };
