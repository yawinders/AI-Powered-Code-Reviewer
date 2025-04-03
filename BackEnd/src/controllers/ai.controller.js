const aiService = require("../services/ai.service")
const axios = require('axios');


module.exports.getReview = async (req, res) => {

    const code = req.body.code;

    if (!code) {
        return res.status(400).send("Prompt is required");
    }

    const response = await aiService(code);


    res.send(response);

}
module.exports.getOutput = async (req, res) => {
    const { code, language_id } = req.body;
    console.log(code, language_id, process.env.API_KEY);


    if (!code || !language_id) {
        return res.status(400).json({ error: "Code and language_id are required" });
    }

    try {
        // Submit the code to Judge0 API
        const response = await axios.post(
            `${process.env.JUDGE0_API_URL}`,
            { source_code: code, language_id },
            {
                headers: {
                    "X-RapidAPI-Key": process.env.API_KEY,
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                    "Content-Type": "application/json",
                },
            }
        );

        // Send output to frontend
        // res.send(response);
        res.json({
            output: response.data.stdout || response.data.stderr || "Execution error",
        });
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message || "Server error" });
    }
};