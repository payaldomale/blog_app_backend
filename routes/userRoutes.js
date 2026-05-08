const express = require("express");
const { fetchAllUsers, getUsersByIdAndName, updateProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/user/getAllUsers", authMiddleware, fetchAllUsers);
router.put("/user/profile/:id", authMiddleware, updateProfile);
router.get("/user/search", authMiddleware, getUsersByIdAndName);

module.exports = router;
