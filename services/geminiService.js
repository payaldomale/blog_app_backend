// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// /* ---------------- AI TITLE ---------------- */
// const generateTitle = async (content) => {
//     try {
//         const model = genAI.getGenerativeModel({
//             model: "gemini-2.5-flash",
//         });

//         const result = await model.generateContent(`
// You are a professional blog assistant.

// Task:
// Generate 5 high-quality blog titles for the given article.

// Rules:
// - Each title must be max 10 words
// - No numbering (no 1., 2., etc.)
// - No explanations
// - No extra text
// - Return ONLY a valid JSON array of strings

// Format strictly like this:
// [
//   "Title 1",
//   "Title 2",
//   "Title 3",
//   "Title 4",
//   "Title 5"
// ]

// Article:
// """
// ${content}
// """
//         `);

//         const text = result.response.text();

//         // Extract JSON safely
//         const jsonStart = text.indexOf("[");
//         const jsonEnd = text.lastIndexOf("]");

//         if (jsonStart === -1 || jsonEnd === -1) {
//             throw new Error("Invalid AI response format");
//         }

//         const cleanJson = text.slice(jsonStart, jsonEnd + 1);

//         const titles = JSON.parse(cleanJson);

//         return titles;

//     } catch (err) {
//         console.error("GEMINI ERROR:", err);
//         throw err;
//     }
// };

// /* ---------------- AI SUMMARY ---------------- */
// const generateSummary = async (content) => {
//     try {
//         const model = genAI.getGenerativeModel({
//             model: "gemini-2.5-flash",
//             // model: "gemini-1.5-flash-latest",
//         });

//         const prompt = `
// You are a professional blog editor.

// Summarize the following blog content in a clear, engaging, and concise way.

// Rules:
// - Max 2-3 sentences
// - Keep it simple and readable
// - Do not lose meaning
// - Write like a blog preview summary

// Content:
// ${content}
//         `;

//         const result = await model.generateContent(prompt);

//         return result.response.text();

//     } catch (err) {
//         console.error("GEMINI SUMMARY ERROR:", err);
//         throw err;
//     }
// };

// module.exports = { generateTitle, generateSummary };



const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ---------------- MODEL POOL ---------------- */
const MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
];

/* ---------------- UTIL: sleep ---------------- */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* ---------------- CORE AI ENGINE ---------------- */
const generateWithFallback = async (prompt) => {

    let lastError;

    for (let i = 0; i < MODELS.length; i++) {

        try {
            const model = genAI.getGenerativeModel({
                model: MODELS[i],
            });

            const result = await model.generateContent(prompt);
            return result.response.text();

        } catch (err) {

            console.log(`❌ Model failed: ${MODELS[i]}`);

            // Retry once if it's temporary overload
            if (err?.status === 503) {
                console.log("⚠️ Temporary overload, retrying...");
                await sleep(1500);

                try {
                    const model = genAI.getGenerativeModel({
                        model: MODELS[i],
                    });

                    const result = await model.generateContent(prompt);
                    return result.response.text();

                } catch (retryErr) {
                    lastError = retryErr;
                    continue;
                }
            }

            lastError = err;
        }
    }

    throw lastError;
};

/* ---------------- PARSE JSON SAFELY ---------------- */
const parseJSON = (text) => {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start === -1 || end === -1) {
        throw new Error("Invalid JSON response from AI");
    }

    return JSON.parse(text.slice(start, end + 1));
};

/* ---------------- AI TITLE ---------------- */
const generateTitle = async (content) => {

    const prompt = `
You are a professional blog assistant.

Generate 5 high-quality blog titles.

Rules:
- Max 10 words each
- No numbering
- Return ONLY JSON array

Format:
[
  "Title 1",
  "Title 2",
  "Title 3",
  "Title 4",
  "Title 5"
]

Article:
"""
${content}
"""
    `;

    const text = await generateWithFallback(prompt);
    return parseJSON(text);
};

/* ---------------- AI SUMMARY ---------------- */
const generateSummary = async (content) => {

    const prompt = `
You are a professional blog editor.

Summarize the blog content in 2-3 sentences.

Rules:
- Keep it simple
- Do not change meaning
- No extra text

Content:
"""
${content}
"""
    `;

    return await generateWithFallback(prompt);
};

module.exports = {
    generateTitle,
    generateSummary
};