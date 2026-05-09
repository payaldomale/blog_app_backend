const { getAllUsers, searchUsers, updateUserProfile } = require("../models/userModel");

const fetchAllUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        // console.log("-----------", users);
        return res.json(users);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const getUsersByIdAndName = async (req, res) => {
    try {

        const { id, username } = req.query;

        const users = await searchUsers(id, username);

        return res.status(200).json(users);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const targetUserId = parseInt(req.params.id);
        const requester = req.user;

        const isAdmin = requester.role === "admin";
        const isSelf = requester.id === targetUserId;

        if (!isAdmin && !isSelf) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { username, bio, avatar_url } = req.body;

        const updatedUser = await updateUserProfile(
            targetUserId,
            username,
            bio,
            avatar_url
        );

        res.json(updatedUser);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error updating profile" });
    }
};

module.exports = { fetchAllUsers, getUsersByIdAndName, updateProfile };
