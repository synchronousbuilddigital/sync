const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.OPENROUTER_API_KEY;
const model = "nvidia/nemotron-3-super-120b-a12b:free";

async function test() {
    console.log("Testing API Key:", API_KEY ? "Present" : "Missing");
    if (!API_KEY) return;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: "Say hello" }]
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Data:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

test();
