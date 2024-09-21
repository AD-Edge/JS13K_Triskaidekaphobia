// Test Server
const fs = require('fs');
const cors = require('cors');
const Web3 = require('web3');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Load environment variables from .env file
dotenv.config();
// process.env.WALLET_KEY

// Middleware for body parsing
app.use(bodyParser.json());
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

app.post('/new-connect', (req, res) => {
    const { wID } = req.body;
    if (!wID === undefined) {
        return res.status(400).json({ error: 'No valid wallet provided' });
    }

    // Prep timestamp
    // ISO format: "2024-09-13T14:15:30.000Z"
    const timestamp = new Date();
    const formattedTimestamp = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1)
        .toString().padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')} `
        + `${timestamp.getHours().toString().padStart(2, '0')}:`
        + `${timestamp.getMinutes().toString().padStart(2, '0')}:`
        + `${timestamp.getSeconds().toString().padStart(2, '0')}`;
    // Prep data to be saved
    const data = `${formattedTimestamp}, WalletID: ${wID}\n`;

    // Append the username and score to a file (scores.txt)
    fs.appendFile('login.txt', data, (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).json({ error: 'Failed to store login' });
        }

        // Send a success response
        res.status(200).json({ message: 'Login submitted successfully - 0x..' + wID.slice(-4) });
        console.log('/new-connect processed successfully  - 0x..' + wID.slice(-4));
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});