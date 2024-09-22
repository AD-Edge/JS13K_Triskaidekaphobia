// Test Server
const fs = require('fs');
const cors = require('cors');
const {Web3} = require('web3')
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

var init = false; 

// Load environment variables from .env file
dotenv.config();
// process.env.WALLET_KEY

// Load environment variables
// const { INFURA_API_URL, WALLET_KEY, WALLET_ADDRESS, CONTRACT_ADDRESS } = process.env;

const INFURA_API_URL = process.env.INFURA_API_URL;
const WALLET_KEY = process.env.WALLET_KEY;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// const web3 = new Web3(INFURA_API_URL);
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_API_URL));

// const avalancheTestnetParams = {
//     chainId: '0xA869', // Avalanche Fuji Testnet Chain ID (hex)
//     chainName: 'Avalanche Fuji Testnet',
//     nativeCurrency: {
//         name: 'Avalanche',
//         symbol: 'AVAX',
//         decimals: 18
//     },
//     rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
//     blockExplorerUrls: ['https://testnet.snowtrace.io/']
// };

const ContractABI = 
[
    {
        "inputs": [
        {
            "internalType": "address",
            "name": "owner",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        }
        ],
        "name": "balanceOf",
        "outputs": [
        {
            "internalType": "uint256",
            "name": "result",
            "type": "uint256"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
]

// Middleware for body parsing
app.use(bodyParser.json());
// Middleware  -handle JSON requests
app.use(express.json());
// Enable CORS for all routes
app.use(cors());

// Init
if(!init) {
    init = true;

    initializeServer();
}

function initializeServer() {
    console.log("Server Initilized");
}

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

// Contract instance
const nftContract = new web3.eth.Contract(ContractABI, CONTRACT_ADDRESS);
// var sendStatus = null;

app.post('/dispatch-badge', async (req, res) => {
    const { toAddress, tokenId } = req.body;
  
    if (!toAddress || !tokenId) {
      return res.status(400).send('Missing required parameters');
    }
    try {
        console.log("dispatch request for tokenID " + tokenId + ", to send to wallet: " + toAddress);

        const gasPrice = await web3.eth.getGasPrice();
        if (gasPrice != null) {
            console.log("Gas price: " + gasPrice);
        }
        const chainId = await web3.eth.getChainId();
        if (chainId != null) { 
            console.log("Chain ID: " + chainId);
        }
        // Estimate gas for the transaction
        // const gasEstimate = await nftContract.methods.safeTransferFrom(WALLET_ADDRESS, toAddress, 2, 1, web3.utils.asciiToHex('')).estimateGas({ from: WALLET_ADDRESS });
        // if (gasEstimate != null) { 
        //     console.log("gas estimate: " + gasEstimate);
        // }
        console.log("tx Sending from: " + WALLET_ADDRESS);
        console.log("tx to: " + CONTRACT_ADDRESS);
        console.log("to address: " + toAddress);
        console.log("tokenID: " + tokenId);
        console.log("key: " + WALLET_KEY.slice(-4));
        
        // check address here
        const tx = {
            from: WALLET_ADDRESS, // Your wallet address
            to: CONTRACT_ADDRESS, // The contract address for the NFT
            // gas: gasEstimate, // Gas limit (estimated)
            gas: 350000, // Gas limit (estimated)
            gasPrice: gasPrice, // Current gas price
            data: nftContract.methods.safeTransferFrom(WALLET_ADDRESS, toAddress, 2, 1, web3.utils.asciiToHex('')).encodeABI(), // Encoded method call
        };

        // Sign the transaction using your wallet's private key
        const signedTx = await web3.eth.accounts.signTransaction(tx, WALLET_KEY); // Use your private key

        // Send the signed transaction
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log(`Transaction successful: ${receipt.transactionHash}`);
        res.send(`Transaction successful: ${receipt.transactionHash}`);

    } catch (error) {
        console.log(`Transaction failed: ${error.message}`);
        res.status(500).send(`Transaction failed: ${error.message}`);
    }
    // try {
    //     // Transaction data
    //     const tx = {
    //       from: WALLET_ADDRESS,
    //       to: CONTRACT_ADDRESS,
    //       gas: 25000000001,
    //       gasPrice,
    //       data: nftContract.methods.safeTransferFrom(WALLET_ADDRESS, toAddress, tokenId, 1, web3.utils.asciiToHex('')).encodeABI(),
    //     };
    
    //     // Sign transaction
    //     const signedTx = await web3.eth.accounts.signTransaction(tx, WALLET_KEY);
    
    //     // Send transaction
    //     const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    //     console.log(`Transaction successful: ${receipt.transactionHash}`);
    //     res.send(`Transaction successful: ${receipt.transactionHash}`);
    // } catch (error) {
    //       console.log(`Transaction failed: ${error.message}`);
    //     res.status(500).send(`Transaction failed: ${error.message}`);
    // }

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

// Dispatch NFT
// async function sendNFT() {
//     if (wallet == null) {
//         sendStatus = 'No wallet connected';
//         return;
//     }
//     sendStatus = 'Dispatch requested...';
    
//     try {
//         // Call the safeTransferFrom method to send the NFT with an empty data field
//         await nftContract.methods.safeTransferFrom(wallet, recipientAddress, sendID, 1, web3.utils.asciiToHex(''))
//             .send({ from: wallet });

//         sendStatus = 'Success!';
//         alert(`ERC-1155 token with Token ID ${sendID} has been sent to ${recipientAddress}`);
//     } catch (error) {
        
//         sendStatus = 'Error sending NFT';
//         console.error('Error sending NFT:', error);
//         alert('Failed to send the NFT.');
//     }
// }
