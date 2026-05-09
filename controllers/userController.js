const { getAllUsers, searchUsers, updateUserProfile, removeUser } = require("../models/userModel");

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

const deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const dltUser = await removeUser(userId);
        res.status(200).json({
            message: "user successfully deleted",
            userId
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            status_code: 500
        })
        console.log("error:", err)
    }
}

module.exports = { fetchAllUsers, getUsersByIdAndName, updateProfile, deleteUser };
