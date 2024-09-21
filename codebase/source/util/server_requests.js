function opponentDefeated(num, wallet) { 
    // Setup URL call
    let reqURL = null;
    if(num == 1) {
        reqURL = 'http://localhost:3000/check?' + 'value=1'
    } else if (num == 2) {
        reqURL = 'http://localhost:3000/check?' + 'value=2'
    } else if (num == 3) {
        reqURL = 'http://localhost:3000/check?' + 'value=3'
    } else if (num == 4) {
        reqURL = 'http://localhost:3000/check?' + 'value=4'
    }
    // Fetch
    fetch(reqURL)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // or response.json() if expecting JSON
    })
    .then(data => {
        console.log('Response:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

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