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

        const user = await searchUsers(id, username);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Check if user is deleted
        if (user.is_deleted === true) {
            return res.status(400).json({
                success: false,
                message: "Cannot fetch a deleted user",
            });
        }

        return res.status(200).json(user);

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

        const user = await updateUserProfile(targetUserId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Check if user is deleted
        if (user.is_deleted === true) {
            return res.status(400).json({
                success: false,
                message: "Cannot update a deleted user",
            });
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

        if (!dltUser) {
            res.status(404).json({
                message: "User not found",
                status_Code: 404
            })
        }

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
