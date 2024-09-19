// Test Server
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000; 

// Middleware  -handle JSON requests
app.use(express.json());
// Enable CORS for all routes
app.use(cors());

// Route for /check
app.get('/check', (req, res) => {
    // Get the value from the query parameters
    const value = req.query.value;
    // Respond based on the value
    if (value === '1') {
        res.send('Hello! test1');
        console.log("Sent: Hello! test1");
    } else if (value === '2') {
        res.send('Hello! test2');
        console.log("Sent: Hello! test2");
    } else {
        res.status(400).send('Invalid value');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});