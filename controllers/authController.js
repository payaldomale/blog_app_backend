const User = require("../models/auth");
const { hashPassword } = require("../utils/hash");
const { comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/token");

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                status_code: 400
            });
        }

        // const user = await User.createUser(email, password);
        const hashedPassword = await hashPassword(password);
        const user = await User.createUser(email, hashedPassword);

        res.status(201).json({
            message: "User successfully created",
            user,
            status_code: 201
        });

    } catch (err) {
        console.log("error:", err);
        res.status(500).json({
            message: "Something went wrong",
            status_code: 500
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                status_code: 400
            });
        }
        // console.log("user:", user)
        const isMatch = await comparePassword(password, user.password_hash);
        // console.log("ismatch:", isMatch)
        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password",
                status_code: 400
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "User successfully logged in",
            token,
            user: { id: user.id, email: user.email, role: user.role },
            status_code: 200
        });

    } catch (err) {
        console.log("error:", err);
        res.status(500).json({
            message: "Something went wrong",
            status_code: 500
        });
    }
};

module.exports = { signup, login };
