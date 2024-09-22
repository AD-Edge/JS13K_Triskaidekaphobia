async function opponentDefeated(toAddress, tokenId) { 
    try {
        const response = await fetch('http://www.delta-edge.com:3000/dispatch-badge', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            toAddress: toAddress,
            tokenId: tokenId,
        }),
        });
        
        if (response.ok) {
            // Parse JSON response
            const data = await response.json();
            console.log(`Transaction successful: ${data.transactionHash}`);
        } else {
            console.error('Failed to send NFT');
        }
    } catch (err) {
      console.error('Error making the request:', err);
    }
}

const newLoginConnect = async (wID) => {
    // const response = await fetch('http://localhost:3000/new-connect', {
    const response = await fetch('http://www.delta-edge.com:3000/new-connect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ wID })
    });

    const result = await response.json();
    console.log(result);
};