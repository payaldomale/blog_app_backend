const { generateTitle, generateSummary } = require("../services/geminiService");

/* ---------------- AI TITLE ---------------- */
const createTitle = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required",
            });
        }

        const titles = await generateTitle(content);

        return res.status(200).json({
            success: true,
            titles,
        });

    } catch (err) {
        console.log("AI ERROR:", err.message);

        return res.status(500).json({
            success: false,
            message: "AI generation failed",
            error: err.message,
        });
    }
};


/* ---------------- AI SUMMARY ---------------- */
const createSummary = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                message: "Content is required"
            });
        }

        const summary = await generateSummary(content);

        return res.json({
            success: true,
            summary
        });

    } catch (err) {
        console.log("AI SUMMARY ERROR:", err.message);

        return res.status(500).json({
            message: "AI summary generation failed",
            error: err.message
        });
    }
};

module.exports = { createTitle, createSummary };
