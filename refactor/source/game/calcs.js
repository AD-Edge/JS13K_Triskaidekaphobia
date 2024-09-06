/////////////////////////////////////////////////////
// Card Calculations Class
/////////////////////////////////////////////////////

function getTopCard(arr) {
    let top = 0;
    let inx = 0;
    for(let i = 0; i < arr.length; i++){
        console.log("checking slot: " + i);
        if(arr[i].getRank() > top) {
            top = arr[i].getRank();
            inx = i;            
            console.log("top card found, rank: " + top);
            console.log("top index: " + inx);
        }
    }
    console.log("return index: " + inx);
    return inx;
}

function findWinner(array1, array2) {

    // Iterate over array 1, find smallest card
    
    // Iterate over array 2, find smallest card
    
    // Compare & return 1 or 0 
    
    if(array1.length > 0) {
        zzfx(...[1.0,,243,.03,.01,.14,1,.2,5,,147,.05,,,,,.02,.66,.04,,-1404]); // Win
        return true;
    } else {
        zzfx(...[1.9,.01,204,.02,.21,.26,2,2.3,,,,,,.1,,.4,.03,.87,.1]); // B Loss
        return false            
    }
}
