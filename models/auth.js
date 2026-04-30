const db = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/hash");

const createUser = async (email, password) => {
    const hashedPassword = await hashPassword(password);

    const query = `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email
    `;

    const result = await db.query(query, [email, hashedPassword]);
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email=$1`;
    const result = await db.query(query, [email]);
    return result.rows[0];
};

module.exports = { createUser, findUserByEmail };
