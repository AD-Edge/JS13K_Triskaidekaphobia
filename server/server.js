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
    // Get the value from the query param
    const value = req.query.value;

    // Respond based on the value
    if (value === '1') {
        res.send('Opponent was defeated: test1');
        console.log("Sent: Opponent was defeated: test1");
    } else if (value === '2') {
        res.send('Opponent was defeated: test2');
        console.log("Sent: Opponent was defeated: test2");
    } else if (value === '3') {
        res.send('Opponent was defeated: test3');
        console.log("Sent: Opponent was defeated: test3");        
    } else if (value === '4') {
        res.send('Opponent was defeated: test4');
        console.log("Sent: Opponent was defeated: test4");        
    } else {
        res.status(400).send('Invalid value');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});