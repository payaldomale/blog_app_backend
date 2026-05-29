const { getPostsQuery } = require("../models/postQueryModel");

const getPosts = async (req, res) => {

    try {

        let {
            page,
            limit,
            sortBy,
            order,
            status,
            userId
        } = req.query;

        // DEFAULTS
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        order = order || "DESC";
        sortBy = sortBy || "created_at";

        const offset = (page - 1) * limit;

        const posts = await getPostsQuery({
            limit,
            offset,
            sortBy,
            order,
            status,
            userId
        });

        return res.status(200).json({
            page,
            limit,
            count: posts.length,
            data: posts
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });
    }
};

module.exports = { getPosts };
