// This file now exports its logic to be used by server.js

// Import the Groq SDK
import Groq from 'groq-sdk';

// Initialize Groq with the API key from environment variables
// IMPORTANT: Remember to set the GROQ_API_KEY in your hosting environment (Vercel, IONOS, etc.)
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// The handler function is now exported to be used in server.js
export async function getUfoNewsHandler(req, res) {
    try {
        // This is the prompt sent to the Groq AI
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are a space intelligence analyst. Your task is to find 3 of the latest or most significant UFO/UAP news stories or sightings.
                    
                    For each story, provide the following:
                    1.  A compelling, short title (e.g., "Anomalous Signal from Proxima Centauri").
                    2.  A concise, one or two-sentence summary of the event.
                    3.  A plausible, thematic source name (e.g., "Cosmic Chronicle", "UAP News Network").
                    4.  A valid, real URL to a news article about the topic if possible, otherwise use "javascript:void(0);".
                    
                    You MUST respond with only a valid JSON array of objects, with no other text, commentary, or markdown. The keys for each object must be "title", "summary", "source", and "url".
                    Example format:
                    [
                        {
                          "title": "Example Title",
                          "summary": "This is an example summary.",
                          "source": "Example Source",
                          "url": "https://example.com"
                        }
                    ]`
                },
                {
                    role: 'user',
                    content: 'Find the latest UFO news.',
                },
            ],
            model: 'llama3-8b-8192', // Using a fast and capable model
            temperature: 0.7,
            response_format: { type: 'json_object' }, // Ensures we get JSON back
        });

        const newsContent = chatCompletion.choices[0]?.message?.content;
        const parsedContent = JSON.parse(newsContent);
        
        // The AI might wrap the JSON, so this finds the array within the response
        const newsArray = Array.isArray(parsedContent) ? parsedContent : Object.values(parsedContent)[0];

        // Send the final array of news back to your website
        res.status(200).json(newsArray);

    } catch (error) {
        // If anything goes wrong, log the error and send a helpful message
        console.error('Error fetching from Groq API:', error);
        res.status(500).json({ error: 'Failed to retrieve intel from the cosmic network.' });
    }
}

