// Import necessary packages
import express from 'express';
import cors from 'cors';
import { getUfoNewsHandler } from './api/get-ufo-news.js';

// Initialize the Express app
const app = express();

// IONOS provides the port via an environment variable
const port = process.env.PORT || 8080;

// Use CORS to allow requests from your main website
// In production, you should restrict this to your actual domain for better security
// Example: app.use(cors({ origin: 'https://alein.info' }));
app.use(cors());

// Define the API route. When your website calls this endpoint...
app.get('/api/get-ufo-news', getUfoNewsHandler);

// Start the server and listen for incoming requests
app.listen(port, () => {
    console.log(`ALEIN Intel Hub server is running on port ${port}`);
});
