function opponentDefeated(num, wallet) { 

    // Setup URL call
    let reqURL = null;
    if(num == 1) {
        url = 'http://localhost:3000/check?' + 'value=1'
    } else if (num == 2) {
        url = 'http://localhost:3000/check?' + 'value=2'
    } else if (num == 3) {
        url = 'http://localhost:3000/check?' + 'value=3'
    } else if (num == 4) {
        url = 'http://localhost:3000/check?' + 'value=4'
    }

    // Fetch
    fetch(url)
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