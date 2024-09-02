async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            const address = await signer.getAddress();
            document.getElementById("connectWallet").innerText = `Connected: ${address}`;
            await checkNFTs(address);
        } catch (error) {
            console.error("User rejected the request");
        }
    } else {
        alert("Please install MetaMask");
    }
}