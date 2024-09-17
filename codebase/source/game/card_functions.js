
function removeCardFromArray(array, index) {
    array.splice(index, 1);
}

function moveCardToArray(cHeld, moveTo) {
    let cHeldA = cHeld[0];
    let cIndex = cHeld[1];
    cHeldA[cIndex].resetOnDrop();
    // Add to moveTo array
    moveTo.push(cHeldA[cIndex]);
    // let index = playerCardHand.indexOf(cHeld[0])
    // Remove the object from given array
    if (cIndex !== -1) {
        cHeldA.splice(cIndex, 1);
    }
}

// Tracks when to decrement deck size
function dealCardCheck() {
    quaterTrack++;
    // Deck shrink check
    if(quaterTrack >= quater) {
        quaterTrack = 0; //reset
        dOffset -= .008; //shadow render offset
        removeCardFromArray(deckStack, deckStack.length-1);
    }
}

// Transfers cards from cardGenQUEUE to Player/Opponent
function cardTransferArray(choose) {
    if(choose) {
        if(cardGenQueueA.length > 0) {
            // Add the card to the playerCardHand
            playerCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            unSettleNewCard(cardASlots, playerCardHand, 1);
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            // Update card stats
            cardNum++; deckTotal--;
            uiT[71].updateSTR(deckTotal);
            zzfx(...[.6*mVo,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
            dealCardCheck()
        }
    } else {
        if(cardGenQueueA.length > 0) {
            // Add the card to the opponentCardHand
            opponentCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            opponentCardHand[opponentCardHand.length-1].flipCard(true);
            unSettleNewCard(cardBSlots, opponentCardHand, 1);
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            // Update card stats
            cardNum++; deckTotal--;
            uiT[71].updateSTR(deckTotal);
            zzfx(...[.6*mVo,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
            dealCardCheck()
        }
    }
}

function resetSlotPositions(positions, array, uset) {
    for(let i=0; i < array.length; i++) {
        array[i].setSlotPos(positions[i]);
        if(uset) {
            array[i].setSettled(false);
        }
    }
}
function unSettleNewCard(positions, array, uset) {
    let i = array.length-1;
    array[i].setSlotPos(positions[i]);
    if(uset) {array[i].setSettled(false);}
}

// Shuffle given card, in index, to final spot in array
function shuffleCardToTop(array, index) {
    // Remove card at index
    const selectedCard = array.splice(index, 1)[0];
    // Add card back to top of stack with push        
    array.push(selectedCard);

    // resetSlots(array);

    return array.length-1;
}

function rejectDrop() {
    zzfx(...[.9*mVo,,480,.03,.13,.15,,3.6,8,-6,,,.02,,,,,.94,.16,.15]); // Shoot 959 
    let ar = currentHeld[0];
    ar[currentHeld[1]].setSettled(false);
}
