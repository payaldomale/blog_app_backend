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

// const updateProfile = async (req, res) => {
//     try {
//         // const userId = req.user.id;
//         const userId = req.params.id;
//         console.log("ID:", userId);
//         console.log("id:", req.user.id);
//         if (req.user.id != userId) {
//             return res.status(403).json({ message: "Forbidden" });
//         }
//         const { username, bio, avatar_url } = req.body;
//         const updatedUser = await updateUserProfile(
//             userId,
//             username,
//             bio,
//             avatar_url
//         );

//         res.json(updatedUser);

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: "Error updating profile"
//         });
//     }
// };

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

module.exports = { fetchAllUsers, updateProfile };
