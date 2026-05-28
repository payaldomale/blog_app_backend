require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentsRoutes = require("./routes/commentsRoutes");

app.use(express.json());
app.use(cors());


app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", postRoutes);
app.use("/api", commentsRoutes);

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
})

module.exports = app;
