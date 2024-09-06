
let provider, signer;
let walletMM = null;

async function connectWallet() {
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

function disconnectWallet() {
    provider = null;
    signer = null;
    walletMM = null;
    
    console.log("Wallet Disconnected::: null");
    uiT[11].updateSTR('NOT CONNECTED');
    uiB[9].updateSTR('CONNECT WALLET');
    uiB[9].updateCOL('#AAF');
    highlight = 0.5;
}