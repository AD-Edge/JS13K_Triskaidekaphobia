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
    let a1Top = 0;
    let a2Top = 0;
    let draw = false;
    // Iterate over array 1, find smallest card
    if(array1.length > 0) {
        // console.log("---------array 1 size: " + array1.length);
        let a1Index = getTopCard(array1);
        a1Top = array1[a1Index].getRank();
    }
    // Iterate over array 2, find smallest card
    if(array2.length > 0) {
        // console.log("---------array 2 size: " + array2.length);
        let a2Index = getTopCard(array2);
        a2Top = array2[a2Index].getRank();
    }
    console.log("---------array 1 top card: " + a1Top);
    console.log("---------array 2 top card: " + a2Top);
    if(a1Top == a2Top) {
        draw = true;
    }

    if(!draw) {
        if(a1Top > a2Top) {
            console.log("PLAYER WINS");
            zzfx(...[1.0,,243,.03,.01,.14,1,.2,5,,147,.05,,,,,.02,.66,.04,,-1404]); // Win
            return 1;
        } else {
            console.log("OPPONENT WINS");
            zzfx(...[1.9,.01,204,.02,.21,.26,2,2.3,,,,,,.1,,.4,.03,.87,.1]); // B Loss
            return -1;            
        }
    } else {
        console.log("THIS ROUND WAS A DRAW");
        return 0;
    }
}
