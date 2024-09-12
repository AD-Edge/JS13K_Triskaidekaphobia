// server.js

const express = require('express');
const app = express();
const port = 3000; 

// Middleware to handle JSON requests
app.use(express.json());

// Route for /check
app.get('/check', (req, res) => {
    // Get the value from the query parameters
    const value = req.query.value;
    // Respond based on the value
    if (value === '1') {
        res.send('Hello! test1');
    } else if (value === '2') {
        res.send('Hello! test2');
    } else {
        res.status(400).send('Invalid value');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});