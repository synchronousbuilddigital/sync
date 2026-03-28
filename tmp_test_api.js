const axios = require('axios');

const key = "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";

async function test() {
    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
            messages: [
                { role: 'user', content: 'hello' }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('SUCCESS:', response.data);
    } catch (error) {
        console.log('ERROR:', error.response ? error.response.data : error.message);
    }
}

test();
