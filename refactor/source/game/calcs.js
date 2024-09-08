/////////////////////////////////////////////////////
// Card Calculations Class
/////////////////////////////////////////////////////

// Returns an array
// [Index value of top card, Score amount of top card]
function getTopCard(arr) {
    let top = 0;
    let inx = 0;
    let score = 0;
    for(let i = 0; i < arr.length; i++) {
        console.log("checking slot: " + i);
        let cardRank = arr[i].getRank();
        let cardSuit = arr[i].getSuit();
        score = getCardScore(cardRank, cardSuit);

        if(score > top) {
            top = arr[i].getRank();
            inx = i;            
            console.log("top card found, rank: " + top);
            console.log("top index: " + inx);
        }
    }
    console.log("return index: " + inx);
    return [inx, score];
}

// Returns the score of the given rank and suit card
function getCardScore(rank, suit) {
    let indexR = cardOrder.indexOf(rank);
    let indexS = suitOrder.indexOf(suit);
    if(indexS != 0) { // Suit only a small point amount
        indexS = indexS/10;
    }

    console.log("Rank: " + rank + ", Suit: " + suit);
    console.log("Rank Index: " + indexR + ", Suit: " + indexS);

    return indexR + indexS;
}

// Takes Table and Hand arrays for a given user
// Checks if there are any pairs, returns rank if there is
function lookForPair(arr1, arr2) {
    let curHand = [];
    let curTable = [];
    let pairRank = -1;
    // Check Hand 1st
    for(let i = 0; i < arr1.length; i++) {
        let arr1Rank = cardOrder.indexOf(arr1[i].getRank()); //get rank index
        for(let j = 0; j < curHand.length; j++) {
            let nextCheck = curHand[j];
            console.log("--- pair checking card of index: " + arr1Rank + " vs " + nextCheck);
            if (arr1Rank == nextCheck) { // Pair found
                if(arr1Rank > pairRank) {
                    console.log("--- PAIR FOUND");
                    pairRank = arr1Rank; // set new highest pair found
                }
            }
        }
        // add next rank index to checking array
        curHand[curHand.length] = arr1Rank;
    }
    return pairRank;
}



// Returns winning comparison result between two arrays of cards
// -1=Player LOSS, 0=TIE, 1=Player WIN
function findWinner(array1, array2) {
    let a1Top = 0;
    let a1Score = 0;
    let a2Top = 0;
    let a2Score = 0;
    let draw = false;
    // Iterate over array 1, find smallest card
    if(array1.length > 0) {
        // console.log("---------array 1 size: " + array1.length);
        let a1TopCard = getTopCard(array1);
        a1Top = array1[a1TopCard[0]].getRank();
        a1Score = a1TopCard[1];
    }
    // Iterate over array 2, find smallest card
    if(array2.length > 0) {
        // console.log("---------array 2 size: " + array2.length);
        let a2TopCard = getTopCard(array2);
        a2Top = array2[a2TopCard[0]].getRank();
        a2Score = a2TopCard[1];
    }
    console.log("---------array 1 top card: " + a1Top);
    console.log("---------array 1 score: " + a1Score*10);
    console.log("---------array 2 top card: " + a2Top);
    console.log("---------array 2 score: " + a2Score*10);
    if(a1Score == a2Score) {
        draw = true;
    }

    if(!draw) {
        if(a1Score > a2Score) {
            console.log("PLAYER WINS");
            zzfx(...[1.0,,243,.03,.01,.14,1,.2,5,,147,.05,,,,,.02,.66,.04,,-1404]); // Win
            return 1;
        } else {
            console.log("OPPONENT WINS");
            zzfx(...[1.9,.01,204,.02,.21,.26,2,2.3,,,,,,.1,,.4,.03,.87,.1]); // B Loss
            return -1;            
        }
    } else {
        console.log("THIS ROUND WAS A TIE");
        return 0;
    }
}
