const { getAllUsers, updateUserProfile } = require("../models/userModel");

const fetchAllUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        // console.log(users);
        return res.json(users);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, bio, avatar_url } = req.body;
        const updatedUser = await updateUserProfile(
            userId,
            username,
            bio,
            avatar_url
        );

        res.json(updatedUser);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error updating profile"
        });
    }
};

module.exports = { fetchAllUsers, updateProfile };
