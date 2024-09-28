/////////////////////////////////////////////////////
// Card Calculations Class
/////////////////////////////////////////////////////

// Returns an array
// [Index value of top card, Score amount of top card]
function getTopCard(arr) {
    let top = 0;
    let inx = 0;
    let score = 0;
    if(arr.length != 0) {
        for(let i = 0; i < arr.length; i++) {
            // console.log("checking slot: " + i);
            let cardRank = arr[i].getRank();
            let cardSuit = arr[i].getSuit();
            score = getCardScore(cardRank, cardSuit);
    
            if(score > top) {
                top = score; //update top scoring card
                inx = i; // index of new top scoring card
                // console.log("top card found, rank: " + top);
                // console.log("top index: " + inx);
            }
        }
    }
    // console.log("getTopCard return index: " + inx + ' for card rank ' + cardOrder[inx] + 'scoring: ' + top);
    return [inx, top];
}

// Returns the score of the given rank and suit card
function getCardScore(rank, suit) {
    let indexR = cardOrder.indexOf(rank);
    let indexS = suitOrder.indexOf(suit);
    if(indexS != 0) { // Suit only a small point amount
        indexS = indexS/10;
    }

    // console.log("Rank: " + rank + ", Suit: " + suit);
    // console.log("Rank Index: " + indexR + ", Suit: " + indexS);

    return indexR + indexS;
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
            return [1, a1Score*10];
        } else {
            console.log("OPPONENT WINS");
            zzfx(...[1.9,.01,204,.02,.21,.26,2,2.3,,,,,,.1,,.4,.03,.87,.1]); // B Loss
            return [-1,0];
        }
    } else {
        console.log("THIS ROUND WAS A TIE");
        return [0,0];
    }
}

// Evaluate Card Arrays for current status
function calcsCards(arr1, arr2) {
    let curHand = [];
    let curTable = [];
    let curFlsh = [0,0,0,0];

    if(arr1.length != 0) {
        let cardSkip = []; // store values to skip
        //get high card
        let top1 = getTopCard(arr1);
        oHigh = opponentCardHand[top1[0]].getRank();

        //count how many of each card
        // iterate over whole given array/hand
        for(let i = 0; i < arr1.length; i++) {
            //get current card to check
            let cRinx = cardOrder.indexOf(arr1[i].getRank()); //get rank index
            let cCount = 1;
            if(!cardSkip.includes(cRinx)) { // skip if current card index already checked
                //iterate over the whole array again, checking vs our current card
                for(let j = 0; j < arr1.length; j++) {
                    if(j != i) { // skip if this is our current card
                        let nextRinx = cardOrder.indexOf(arr1[j].getRank()); //get rank index
                        // is this the same rank?
                        if(cRinx == nextRinx) {
                            cCount++;
                        }
                    }
                }
            }
            // add to skip index - to skip this rank in next checks
            cardSkip[cardSkip.length] = cRinx;
            // add next rank index to checking array
            // [rank of card, number of that rank present]
            if(cCount > 1) { // more than just the 1x card?
                curHand[curHand.length] = [cRinx, cCount];
            }

            //check flush
            if(arr1[i].getSuit() == 'SPD') {
                curFlsh[3] += 1;
            } else if(arr1[i].getSuit() == 'HRT') {
                curFlsh[2] += 1;
            } else if(arr1[i].getSuit() == 'DMD') {
                curFlsh[1] += 1;
            } else if(arr1[i].getSuit() == 'CLB') {
                curFlsh[0] += 1;
            }
        }
        oDups = curHand; // save to proper variable
        oFlsh = curFlsh;
        // two pair?
        if(oDups.length > 1) {
            oTwoP = true;
        }

        //count number of each suit (flush)
        
        //count max chain (straight)
    }
}