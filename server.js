const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Main route for status check
app.get('/', (req, res) => {
  res.send('Scraper is running');
});

// Start the scraper
require('./event-ft');

// Function to keep the service alive
async function keepAlive() {
  const url = process.env.PROJECT_URL;
  if (url) {
    try {
      await axios.get(url);
      console.log('Ping successful');
    } catch (error) {
      console.error('Ping failed:', error.message);
    }
  }
}

// Ping every 4 minutes
setInterval(keepAlive, 4 * 60 * 1000);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 