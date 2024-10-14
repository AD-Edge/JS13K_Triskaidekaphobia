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
    // Iterate over array 1, find top card
    if(array1.length > 0) {
        // console.log("---------array 1 size: " + array1.length);
        let a1TopCard = getTopCard(array1);
        a1Top = array1[a1TopCard[0]].getRank();
        a1Score = a1TopCard[1];
    }
    // Iterate over array 2, find top card
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

function findWinnerOnScore(scoreA, scoreB) {
    let draw = false;

    console.log("---------array A score: " + scoreA);
    console.log("---------array B score: " + scoreB);
    if(scoreA == scoreB) {
        draw = true;
    }
    if(!draw) {
        if(scoreA > scoreB) {
            console.log("PLAYER WINS");
            zzfx(...[1.0,,243,.03,.01,.14,1,.2,5,,147,.05,,,,,.02,.66,.04,,-1404]); // Win
            return [1, scoreA];
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
function calcsCards(arr1, arr2, id) {
    let curHand = [];
    let curTable = [];
    let curFlsh = [0,0,0,0];
    let pairMult = 0;

    if(arr1.length != 0) {
        let cardSkip = []; // store values to skip
        //get high card
        let top1 = getTopCard(arr1);

        if(id == 'B') {
            oHigh = opponentCardHand[top1[0]].getRank();
            opponentCardHand[top1[0]].setHigh(true);
        } else if (id == 'A') {
            pHigh = playerCardHand[top1[0]].getRank();
            playerCardHand[top1[0]].setHigh(true);
        }

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
                if(cCount == 2) { // individual count for pairs
                    pairMult +=1;
                }
                curHand[curHand.length] = [cRinx, cCount, i];
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
        if(id == 'B') {
            oDups = curHand; // save to proper variable
            oFlsh = curFlsh;
            // two pair?
            if(pairMult >= 2) {
                oTwoP = true;
            }
        } else if (id == 'A') {
            pDups = curHand; // save to proper variable
            pFlsh = curFlsh;
            // two pair?
            if(pairMult >= 2) {
                pTwoP = true;
            }
        }
        
        //count max chain (straight)
    }
}

function getBestHandA() {
    let bestHand = 'tbd';
    if(pBest[0] == 1) {
        bestHand = 'High card';
    } else if (pBest[0] == 2) {
        bestHand = 'Pair';
    } else if (pBest[0] == 3) {
        bestHand = 'Two pair';
    } else if (pBest[0] == 4) {
        bestHand = 'Three of a kind';
    } else if (pBest[0] == 5) {
        bestHand = 'Straight';
    } else if (pBest[0] == 6) {
        bestHand = 'Flush';
    } else if (pBest[0] == 7) {
        bestHand = 'Full house';
    } else if (pBest[0] == 8) {
        bestHand = 'Four of a kind';
    } else if (pBest[0] == 9) {
        bestHand = 'Straight Flush';
    } else if (pBest[0] == 10) {
        bestHand = 'Royal Flush';
    }
    return bestHand;
}
function getBestHandB() {
    let bestHand = 'tbd';
    if(oBest[0] == 1) {
        bestHand = 'High card';
    } else if (oBest[0] == 2) {
        bestHand = 'Pair';
    } else if (oBest[0] == 3) {
        bestHand = 'Two pair';
    } else if (oBest[0] == 4) {
        bestHand = 'Three of a kind';
    } else if (oBest[0] == 5) {
        bestHand = 'Straight';
    } else if (oBest[0] == 6) {
        bestHand = 'Flush';
    } else if (oBest[0] == 7) {
        bestHand = 'Full house';
    } else if (oBest[0] == 8) {
        bestHand = 'Four of a kind';
    } else if (oBest[0] == 9) {
        bestHand = 'Straight Flush';
    } else if (oBest[0] == 10) {
        bestHand = 'Royal Flush';
    }
    return bestHand;
}

function highlightBest(id, rnkCheck) {
    let bestHand = 'tbd';
    if(id == 'A') {
        // what is the current best hand
        bestHand = getBestHandA();
        for(let i = 0; i < playerCardHand.length; i++) {
            //get current card to check
            let cRinx = cardOrder.indexOf(playerCardHand[i].getRank()); //get rank index
            if(cRinx == rnkCheck) {
                playerCardHand[i].setState(1); // part of best hand
            }
        }
        // console.log("[PLAYER] Adding card highlight for best hand: " + bestHand + ' of ' + pBest[1]);
    } else if (id == 'B') {
        // what is the current best hand
        bestHand = getBestHandB();
        for(let i = 0; i < opponentCardHand.length; i++) {
            //get current card to check
            let cRinx = cardOrder.indexOf(opponentCardHand[i].getRank()); //get rank index
            if(cRinx == rnkCheck) {
                opponentCardHand[i].setState(1); // part of best hand
            }
        }
        // console.log("[OPPONENT] Adding card highlight for best hand: " + bestHand + ' of ' + oBest[1]);
    }
}

function clearHighlights() {
    for(let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].setState(0);
        }
    }
    for(let i = 0; i < opponentCardHand.length; i++) {
        if(opponentCardHand[i] != null) {
            opponentCardHand[i].setState(0);
        }
    }
    for(let i = 0; i < tableCardHoldA.length; i++) {
        if(tableCardHoldA[i] != null) {
            tableCardHoldA[i].setState(0);
        }
    }
    for(let i = 0; i < tableCardHoldB.length; i++) {
        if(tableCardHoldB[i] != null) {
            tableCardHoldB[i].setState(0);
        }
    }
}

// Gets 'num' of the lowest cards in the given array
// returns array of indexes of lowest cards
function getLowestCards(num, arr) {
    for (let i = num; i<0; i--) {


    }
    return 0;
}

function scoreCurrentTable(id) {
    let returnScore = 0;
    let curHand = [];
    let curTable = [];
    let curFlsh = [0,0,0,0];
    let twoPair = false;
    let highCard = null;

    if(id=='A') {
        console.log("Finding score for current Player Round: ");
        
        // Check tableCardHoldA & find score 
        if(tableCardHoldA.length != 0) {
            let cardSkip = []; // store values to skip
            //get high card
            let top1 = getTopCard(tableCardHoldA);

            highCard = playerCardHand[top1[0]].getRank();
            // playerCardHand[top1[0]].setHigh(true);

            //count how many of each card
            // iterate over whole given array/hand
            for(let i = 0; i < tableCardHoldA.length; i++) {
                //get current card to check
                let cRinx = cardOrder.indexOf(tableCardHoldA[i].getRank()); //get rank index
                let cCount = 1;
                if(!cardSkip.includes(cRinx)) { // skip if current card index already checked
                    //iterate over the whole array again, checking vs our current card
                    for(let j = 0; j < tableCardHoldA.length; j++) {
                        if(j != i) { // skip if this is our current card
                            let nextRinx = cardOrder.indexOf(tableCardHoldA[j].getRank()); //get rank index
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
                    curHand[curHand.length] = [cRinx, cCount, i];
                }
                //check flush
                if(tableCardHoldA[i].getSuit() == 'SPD') {
                    curFlsh[3] += 1;
                } else if(tableCardHoldA[i].getSuit() == 'HRT') {
                    curFlsh[2] += 1;
                } else if(tableCardHoldA[i].getSuit() == 'DMD') {
                    curFlsh[1] += 1;
                } else if(tableCardHoldA[i].getSuit() == 'CLB') {
                    curFlsh[0] += 1;
                }
            }
            // Two Pair ? 
            if(curHand.length > 1) {
                twoPair = true;
            }

            

        }


        // create function based on calcsCards
        // which just looks at 1x array and returns the score only 



        //loop through all cards, and activate score on valid cards
        //also toggle the card state to display color backing 
        
    } else if(id=='B') {
        console.log("Finding score for current Opponent Round: ");

    }

    if(id == 'A') {
        console.log("##### Score Current Table [A]: " + returnScore);
        
    } else {
        console.log("##### Score Current Table [B]: " + returnScore);
        
    }

    return returnScore;
}