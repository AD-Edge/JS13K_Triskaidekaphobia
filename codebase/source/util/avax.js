/////////////////////////////////////////////////////
// Web3 Stuff
/////////////////////////////////////////////////////
var web3;

let provider, signer;
let walletMM = null;

var sendID = null;
var nft00 = null;
var sendStatus = null;

// Testnet Info
const nftContractAddress = '0x3daF30d975D51550B4B8d582CDA5d463B5554227';
const tokenIdsToCheck = [1, 2, 3, 4, 5];  // token IDs
var ownedNFTs = [];
var balanceNFTs = [0,0,0,0,0,0];

const avalancheTestnetParams = {
    chainId: '0xA869', // Avalanche Fuji Testnet Chain ID (hex)
    chainName: 'Avalanche Fuji Testnet',
    nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io/']
};

// async function connectWallet() {
async function co() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                console.log("Already connected:", accounts[0]);
                return accounts[0]; // Already connected, return the address
            }
            // Otherwise, request connection
            await ethereum.request({ method: 'eth_requestAccounts' });

            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            const address = await signer.getAddress();
            console.log("Wallet Connected::: " + address);
            walletMM = address;
            uiT[11].updateSTR(address);
            uiB[9].updateSTR('DISCONNECT');
            uiB[9].updateCOL('#FAA');
            highlight = 1.0;
            // document.getElementById("connectWallet").innerText = `Connected: ${address}`;
            // await checkNFTs(address);
            return address;
        } catch (error) {
            console.error("Error Occured: " + error);
        }
    } else {
        alert("Please install MetaMask / Not supported on mobile (yet)");
    }
}

// function disconnectWallet() {
function dis() {
    provider = null;
    signer = null;
    walletMM = null;
    
    console.log("Wallet Disconnected::: null");
    uiT[11].updateSTR('NOT CONNECTED');
    uiB[9].updateSTR('CONNECT WALLET');
    uiB[9].updateCOL('#AAF');
    highlight = .5;
}

function loadWeb3() {
    console.log("loading web3....");
    if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/web3@1.7.3/dist/web3.min.js"]')) {
        // Create/Add new element
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/web3@1.7.3/dist/web3.min.js";
        script.onload = function() {
            console.log('Web3.js loaded');
            return true;
        };
        document.body.appendChild(script);
    } else {
        console.log('Web3.js is already loaded');
        return false;
    }
}

function initializeWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);  // Create web3 instance using window.ethereum
        return true;
    } else {
        alert('Please install MetaMask or another Web3 wallet.');
        return false;
    }
}

function connectWallet() {
    // init and check MM
    if (!initializeWeb3()) {
        console.log("error initializing");
        return null;
    }  

    if(walletMM == null & web3 != undefined) {
        connect();
        walletMM = 'requesting connection...';
    }
}

async function connect() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request connect
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Avalanche Testnet check
            const chainId = await web3.eth.getChainId();
            if (chainId !== parseInt(avalancheTestnetParams.chainId, 16)) {
                // Switch network if needed
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: avalancheTestnetParams.chainId }]
                    });
                } catch (switchError) {
                    // Add if not already added to wallet #test this
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [avalancheTestnetParams]
                        });
                    }
                }
            }
            // After successful switch - Connect
            const accounts = await web3.eth.getAccounts();
            walletMM = accounts[0];
            uiT[11].updateSTR(walletMM);
            uiB[9].updateSTR('DISCONNECT');
            uiB[9].updateCOL('#FAA');
            highlight = 1.0;
            console.log('Connected account:', accounts[0]);
            alert('Wallet connected: ' + accounts[0]);
            
            //Check Wallet
            checkForNFTs();
        } catch (error) {
            walletMM = "did not connect";
            console.error('Error connecting wallet:', error);
            alert('Failed to connect wallet');
        }
    } else {
        alert('Please install MetaMask or another Web3 wallet.');
    }
}

function disconnectWallet() {
    if (walletMM) {
        // Clear the connected account variable
        walletMM = null;
        gamePer=0;
        uiT[75].updateSTR(gamePer + "%");
        ownedNFTs = [];
        uiT[11].updateSTR('NOT CONNECTED');
        uiB[9].updateSTR('CONNECT WALLET');
        uiB[9].updateCOL('#AAF');
        highlight = .5;
        console.log('Wallet disconnected');
    } else {
        alert('No wallet is connected.');
    }
}

async function checkForNFTs() {
    console.log("Checking Wallet for NFTs...");
    if (walletMM == null) return;
    // Create a new contract instance with web3
    const nftContract = new web3.eth.Contract(nftContractABI, nftContractAddress);

    nft00 = 'Checking for NFTs...';
    //clear
    ownedNFTs = [];

    // Loop through each token ID specified
    for (const tokenId of tokenIdsToCheck) {
        try {
            // balanceOf - checks how many of the specific token the account owns
            const balance = await nftContract.methods.balanceOf(walletMM, tokenId).call();
            
            //check balance, add to ownedNFTs if there is a balance
            if (balance > 0) {
                ownedNFTs.push(tokenId);
                gamePer+=20;
                uiT[75].updateSTR(gamePer + "%");
                balanceNFTs[tokenId] = balance;
            }
        } catch (error) {
            nft00 = 'error';
            console.error(`Error checking token ID ${tokenId}:`, error);
        }
    }
    
    if (ownedNFTs.length > 0) {
        // alert(`Wallet owns NFTs with token IDs: ${ownedNFTs.join(', ')}`);
        nft00 = 'Tokens found!';
        console.log("found NFTs with IDs: " + ownedNFTs);
    } else {
        nft00 = 'No specified NFTs found';
        // alert('No specified NFTs found in the wallet.');
    }
}

const nftContractABI = 
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
    }
]