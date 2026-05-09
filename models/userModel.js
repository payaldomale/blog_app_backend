const db = require("../config/db");

const getAllUsers = async () => {
    const result = await db.query("SELECT * FROM users");
    return result.rows;
};

const searchUsers = async (userId, username) => {

    let query = `
        SELECT id, username, bio
        FROM users
        WHERE id = $1
           OR username ILIKE $2
    `;

    const result = await db.query(query, [
        userId || -1,
        username ? `%${username}%` : "null"
    ]);

    return result.rows;
};

const updateUserProfile = async (userId, username, bio, avatar_url) => {
    const query = `
        UPDATE users
        SET username=$1,
            bio=$2,
            avatar_url=$3,
            updated_at=NOW()
        WHERE id=$4
        RETURNING id, email, username, bio, avatar_url
    `;

    const result = await db.query(query, [
        username,
        bio,
        avatar_url,
        userId
    ]);

    return result.rows[0];
};

module.exports = { getAllUsers, searchUsers, updateUserProfile };
