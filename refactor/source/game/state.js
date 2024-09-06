/////////////////////////////////////////////////////
// Game State/Logic Management
/////////////////////////////////////////////////////

function manageStateMain() { 
    switch (stateMain) {
        case MAIN_STATES.LOAD:
            console.log('MAIN_STATES.LOAD State started ...');
            statePrev = stateMain;
            //---------------------
            setButtons([]);

            //---------------------            
            break;
        case MAIN_STATES.TITLE:
            console.log('MAIN_STATES.TITLE State started ...');
            statePrev = stateMain;
            //---------------------
            setButtons([1,2,3,9]);

            //---------------------           
            break;
        case MAIN_STATES.CREDITS:
            console.log('MAIN_STATES.CREDITS State started ...');
            statePrev = stateMain;
            //---------------------
            setButtons([4]);

            //---------------------
            break;
        case MAIN_STATES.OPTIONS:
            console.log('MAIN_STATES.OPTIONS State started ...');
            statePrev = stateMain;
            //---------------------
            setButtons([4]);

            //---------------------
            break;
        case MAIN_STATES.GAMEROUND:
            console.log('MAIN_STATES.GAMEROUND State started ...');
            statePrev = stateMain;
            //---------------------
            setButtons([10]);
            uiT[16].updateSTR('ROUND ' + round + ' OF ' + roundMax);
            uiT[17].updateSTR(round);
            highlightR = 1.0;
            initRound = true; //reset
            stateRound = ROUND_STATES.INTRO; //start game round
            // Start Game Sfx
            zzfx(...[0.6,0,65.40639,.11,.76,.41,1,.7,,,,,.31,,,,,.55,.05,.42]);
            //---------------------
            break;
        case MAIN_STATES.ENDROUND:
            console.log('MAIN_STATES.ENDROUND State started ...');
            statePrev = stateMain;
            //---------------------
            
            //---------------------
            break;
        case MAIN_STATES.RESET:
            console.log('MAIN_STATES.RESET State started ...');
            statePrev = stateMain;
            //---------------------
            
            //---------------------
            break;

        default:
            console.log('Main State:???? Process in unknown state, return to title');
            stateMain = MAIN_STATES.TITLE; // Default to title
            // statePrev = stateMain;
            break;
    }
}

function manageStateRound() { 
    switch (stateRound) {
        case ROUND_STATES.INTRO:
            console.log('ROUND_STATES.INTRO State started ...');
            stateRPrev = stateRound;
            //---------------------
            
            //---------------------
            break;
            case ROUND_STATES.DEAL:
            console.log('ROUND_STATES.DEAL State started ...');
            stateRPrev = stateRound;
            //---------------------
            
            //---------------------
            break;
        case ROUND_STATES.PLAY:
            console.log('ROUND_STATES.PLAY State started ...');
            stateRPrev = stateRound;
            //---------------------
            setTimeout(() => {
                setButtons([6,10]);
            }, 900);
            highlight = 0.8;
            
            // SFX for play START
            zzfx(...[0.75,,37,.06,.01,.36,3,1.8,,,,,,.4,63,.4,,.38,.14,.12,-1600]);
            setTimeout(() => {
                let ch = npcOp.makeMove();
                if(ch == 0) {
                    opponentCardHand[0].setsP(dscPos);
                    opponentCardHand[0].setSettled(false);

                    setTimeout(() => {
                        moveCardToArray([opponentCardHand, 0], dscQueue)
                        zzfx(...[.8,,81,,.07,.23,3,3,-5,,,,,.1,,.5,,.6,.06,,202]); // Hit Discard
                        discarded++;
                    }, 100);
                } else if(ch == 1) {
                    let topCard = getTopCard(opponentCardHand);
                    opponentCardHand[topCard].setsP(tableBSlots[0]);
                    moveCardToArray([opponentCardHand, topCard], tableCardHoldB);
                    opponentCardHand[topCard].setSettled(false);
                }
            }, 1100);
            //---------------------
            break;
        case ROUND_STATES.NEXT:
            console.log('ROUND_STATES.NEXT State started ...');
            stateRPrev = stateRound;
            //---------------------

            setButtons([10]);
            if (round < roundMax) {
                initNext = true; // Reset if more rounds left
            } else {
                // setTimeout(() => {
                    stateRound = ROUND_STATES.END;
                // }, 400);
            }
            //---------------------
            break;
        case ROUND_STATES.END:
            console.log('ROUND_STATES.END State started ...');
            stateRPrev = stateRound;
            //---------------------        
            setButtons([0]);
            roundEnd = true;
            playerWin = findWinner(tableCardHoldA, tableCardHoldB);
            // Reset text
            if(playerWin) {
                txtBoxBtxt.updateSTR(npcOp.getRandomTxt(3));
            } else {
                txtBoxBtxt.updateSTR(npcOp.getRandomTxt(2));
            }
            setTimeout(() => {
                txtBoxB = true;
                // Speech sfx
                zzfx(...[,.3,138,,.03,.03,3,1.8,-18,,2,.04,,.1,16,,,.62,.03]);
            }, 900);
            setTimeout(() => {
                zzfx(...[1.2,,9,.01,.02,.01,,2,11,,-305,.41,,.5,3.1,,,.54,.01,.11]); // click
                setButtons([7,8]);
            }, 2000);

            //---------------------
            break;

        case ROUND_STATES.RESET:
            console.log('ROUND_STATES.RESET State started ...');
            stateRPrev = stateRound;
            //---------------------
            // Round settings reset
            roundEnd = false;
            txtBoxB = false;
            initRound = true;
            roundStart = true;
            round = 1;
            uiT[16].updateSTR('ROUND ' + round + ' OF ' + roundMax);
            uiT[17].updateSTR(round);
            playerWin = false;
            // Game State reset
            cardNum = 0;
            deckTotal = 52;
            discarded = 0;
            // Reset card arrays
            currentHeld = null;
            playerCardHand = [];
            opponentCardHand = [];
            tableCardHoldA = [];
            tableCardHoldB = [];
            cardGenQueueA = [];
            dscQueue = [];
            
            stateRound = ROUND_STATES.INTRO;
            //---------------------
            break;

        default:
            console.log('Round State:???? Process in unknown state, return to title');
            console.log('Resetting Game State');
            stateMain = MAIN_STATES.TITLE; // Default to title
            stateRound = ROUND_STATES.RESET; // Default to title
            // statePrev = stateMain;
            // stateRPrev = stateRound;
            break;
    }
}

function tickGame(timestamp) {
    if(stateRound == ROUND_STATES.INTRO) {
        if(initRound) {
            //create all cards for queue
            generateCardsFromDeck(handSize*2);
            //create opponent
            npcOp = new npc(0);
            // Get new intro text
            txtBoxBtxt = new uix(1, txtBoxPos.x, txtBoxPos.y, 1.5, 0, null, npcOp.getRandomTxt(0) , null);
            initRound = false;
        }
        
        if(roundStart) {
            setTimeout(() => {
                txtBoxB = true;
                // Speech sfx
                zzfx(...[,.3,138,,.03,.03,3,1.8,-18,,2,.04,,.1,16,,,.62,.03]);
            }, 500);
            setTimeout(() => {
                setButtons([5, 10]);
            }, 1000);
            roundStart = false;
        }
    } else if (stateRound == ROUND_STATES.DEAL) {
        setTimeout(() => {
            const delayBetweenCards = 150; // 500ms delay between cards
            // if(chooseA) {
            if(timestamp - lastCardCreationTime >= delayBetweenCards) {
                if(playerCardHand.length > opponentCardHand.length) {
                    // console.log("TIMER A");
                    cardTransferArray(chooseA);
                    chooseA = false;   
                } else {
                    // console.log("TIMER B");
                    cardTransferArray(chooseA);
                    chooseA = true;
                }
                // moveCardToArray();
                lastCardCreationTime = timestamp;
                if(debug) { recalcDebugArrays(); }
                // Reset card positions
                for(let i = 0; i < playerCardHand.length; i++) {
                    if(playerCardHand[i] != null){
                        // console.log("updating settled #" + i + " - " + playerCardHand[i].getRank());
                        playerCardHand[i].setSettled(false);
                    }
                }
            }
        }, 300);

        // Cards are delt out, toggle to play
        if(cardGenQueueA.length == 0) {
            setTimeout(() => {
                stateRound = ROUND_STATES.PLAY;
            }, 600);
        }
    } else if (stateRound == ROUND_STATES.PLAY) {
    } else if (stateRound == ROUND_STATES.NEXT) {
        let cardCount = playerCardHand.length + opponentCardHand.length;
        
        if(initNext) {
            round++;
            uiT[16].updateSTR('ROUND ' + round + ' OF ' + roundMax);
            uiT[17].updateSTR(round);
            highlightR = 1.0;
            // Console.log("generate next cards: ");
            if (round <= roundMax) {
                if((cardCount) < handSize*2 ) {
                    generateCardsFromDeck((handSize*2) - cardCount);
                }
                // Reset text
                txtBoxBtxt.updateSTR(npcOp.getRandomTxt(1));
                // Reset back to round intro
                setTimeout(() => {
                    roundStart = true;
                    stateRound = ROUND_STATES.INTRO;
                }, 400);
            }
            initNext = false;
        }
    } else if (stateRound == ROUND_STATES.END) {
    }

    // Check Game areas
    // drawB(.115, .27, .77, .46, '#33224488');
    let hovD = checkHoverArea(.022, .38, .118, .24)
    if(hovD && currentHeld != null) {
        dscActive = true;
        tableActive = false;
        handActive = false;
    } else { // not over discard? check other locations
        dscActive = false;
        // Check table and hand hover states
        let hovT = checkHoverArea(.115, .5, 77, .28)
        if(hovT && currentHeld != null) {
            tableActive = true;
        } else {
            tableActive = false;
        }
        let hovH = checkHoverArea(.2, .85, .6, .2)
        if(hovH && currentHeld != null) {
            handActive = true;
        } else {
            handActive = false;
        }
    }
}

// Just manage mouse position
function getMousePos(e, c) {
    rect = c.getBoundingClientRect();
    // Get Mouse location
    // mouseX = e.clientX - rect.left;
    // mouseY = e.clientY - rect.top;
    let sX = c.width / rect.width;    // Scale factor for X axis
    let sY = c.height / rect.height; 

    mouseX = (e.clientX - rect.left) / sX;
    mouseY = (e.clientY - rect.top) / sY;

    // Inversion for mobile setting
    if(mobile) {
        mouseX = (e.clientY - rect.top) / (sX/2.8);  // Y becomes X, apply scaling
        mouseY = (rect.width - (e.clientX - rect.left)) / (sY/0.9); 
        // let tempX = mouseX;
        // mouseX = mouseY*asp2;
        // mouseY = h2 - (tempX*asp2);
    }
}

function pointerReleased() {
    // Reset everything
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].checkHover(false);
        }
    }
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            titleCds[i].checkHover(false);
        }
    }
    // Reset buttons
    clickPress = false;
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].checkHover(false);
        // console.log("reset");
    }
    // Drop current held
    if(currentHeld != null) {
        zzfx(...[.3,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
        currentHeld = null;
    }
}

// ONLY check for card hovers
function logicCheckHOV() {
    let check = false;
    if(stateMain == MAIN_STATES.GAMEROUND && 
        stateRound == ROUND_STATES.PLAY ) {
        // Check if the card is hovered
        for (let i = 0; i < playerCardHand.length; i++) {
            if(playerCardHand[i] != null) {
                if (playerCardHand[i].checkHover(mouseX, mouseY, w, h)) {    
                    check = true;
                    currentHover = playerCardHand[i];
                    if(currentHeld == null) {
                        playerCardHand[i].isHov = true;
                    }
                } else {
                    playerCardHand[i].isHov = false;
                }
            }
        }
        for (let i = 0; i < tableCardHoldA.length; i++) {
            if(tableCardHoldA[i] != null) {
                if (tableCardHoldA[i].checkHover(mouseX, mouseY, w, h)) {    
                    check = true;
                    currentHover = tableCardHoldA[i];
                    if(currentHeld == null) {
                        tableCardHoldA[i].isHov = true;
                    }
                } else {
                    tableCardHoldA[i].isHov = false;
                }
            }
        }
    }
    if(stateMain == MAIN_STATES.TITLE) {
        for (let i = 0; i < titleCds.length; i++) {
            if(titleCds[i] != null) {
                if (titleCds[i].checkHover(mouseX, mouseY, w, h)) {    
                    check = true;
                    currentHover = titleCds[i];
                    if(currentHeld == null) {
                        titleCds[i].isHov = true;
                    }
                } else {
                    titleCds[i].isHov = false;
                }
            }
        }
    }
    if(check == false) {
        currentHover = null;
    }
    //Only place to check button hover
    for (let i = 1; i < uiB.length; i++) {
        let butHov = uiB[i].checkHover(true);
        if(!butHov) { //disable with no hover
            uiB[i].checkHover(false);
        }
    }
}
// Mouse Click
// Only check on 
function logicCheckCLK() {
    // Button checks
    for (let i = 1; i < uiB.length; i++) {
        let checkD = uiB[i].checkClick(true);
        if(checkD) {
            clickPress = i;
            console.log("Button clicked: " + i);
        }
    }
    if(currentHover == null) {
        checkButtonClicks();
    }
    // Card Checks for grab & shuffle
    if(stateMain == MAIN_STATES.GAMEROUND) {
        for (let i = playerCardHand.length; i >= 0; i--) {
            if(playerCardHand[i] != null && currentHover != null) {
                var click = playerCardHand[i].checkClick(true);
                if(click) {
                    
                    currentHeld = [playerCardHand, i];
                    //shuffle card order
                    shuffleCardToTop(playerCardHand, i)
                    // Pickup quick sfx
                    zzfx(...[.2,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
                    // console.log("currentHeld: " + currentHeld );
                    return;
                }
            }
        }
        for (let i = tableCardHoldA.length; i >= 0; i--) {
            if(tableCardHoldA[i] != null && currentHover != null) {
                var click = tableCardHoldA[i].checkClick(true);
                if(click) {
                    currentHeld = [tableCardHoldA, i];
                    //shuffle card order
                    shuffleCardToTop(tableCardHoldA, i)
                    // Pickup quick sfx
                    zzfx(...[.2,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
                    return;
                }
            }
        }
    } else if(stateMain == MAIN_STATES.TITLE) {
        for (let i = titleCds.length; i >= 0; i--) {
            if(titleCds[i] != null && currentHover != null) {
                var click = titleCds[i].checkClick(true);
                if(click) {
                    currentHeld = titleCds[i];
                    // Pickup quick sfx
                    zzfx(...[.2,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
                    return;
                }
            }
        }
    }

}
// Pointer click up, basically check for buttons, 
// drop held card, and reset everything 
function logicCheckUP() { // pointer up


    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].checkClick(false);
        }
    }
    for (let i = 0; i < tableCardHoldA.length; i++) {
        if(tableCardHoldA[i] != null) {
            tableCardHoldA[i].checkClick(false);
        }
    }
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            titleCds[i].checkClick(false);
        }
    }

    // Drop current held
    if(currentHeld != null) {
        console.log("Dropping held: " + currentHeld);
        zzfx(...[.3,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
        
        if(stateRound == ROUND_STATES.PLAY) {
            if(tableActive) {
                moveCardToArray(currentHeld, tableCardHoldA)
            } else if(handActive) {
                moveCardToArray(currentHeld, playerCardHand)
            } else if(dscActive) {
                zzfx(...[.8,,81,,.07,.23,3,3,-5,,,,,.1,,.5,,.6,.06,,202]); // Hit Discard
                discarded++;
                moveCardToArray(currentHeld, dscQueue)
            }
        }
        // Reset currentHeld to nothing
        currentHeld = null;
        // console.log("Current held reset");
    }
}

function checkButtonClicks() {
    if(clickPress != false && clkDel <= 0) {
        zzfx(...[1.2,,9,.01,.02,.01,,2,11,,-305,.41,,.5,3.1,,,.54,.01,.11]); // click
        if(clickPress == 1) { // START
            setButtons([]);
            stateMain = MAIN_STATES.GAMEROUND;
        } else if (clickPress == 2) { // OPTIONS
            setButtons([]);
            stateMain = MAIN_STATES.OPTIONS;
        } else if (clickPress == 3) { // CREDITS
            setButtons([]);
            stateMain = MAIN_STATES.CREDITS;
        } else if (clickPress == 4) { // BACKtoTitle
            setButtons([]);
            stateMain = MAIN_STATES.TITLE;
        } else if (clickPress == 5) { // Continue
            setButtons([10]);
            if(stateRound == ROUND_STATES.INTRO) {
                stateRound = ROUND_STATES.DEAL;
                txtBoxB = false;
            } else if(stateRound == ROUND_STATES.DEAL) {
                stateRound = ROUND_STATES.PLAY;
            }
        } else if (clickPress == 6) { // Next
            setButtons([10]);
            stateRound = ROUND_STATES.NEXT;
        } else if (clickPress == 7) { // Replay
            setButtons([10]); // Disable all buttons
            stateRound = ROUND_STATES.RESET;
            // Start Game Sfx
            zzfx(...[0.6,0,65.40639,.11,.76,.41,1,.7,,,,,.31,,,,,.55,.05,.42]);
    
        } else if (clickPress == 8) { // Title
            setButtons([]);
            stateRound = ROUND_STATES.RESET;
            stateMain = MAIN_STATES.TITLE;
        } else if (clickPress == 9) { // Wallet Connect
            if(walletMM == null) {
                connectWallet();
            } else {
                disconnectWallet();
            }
        } else if (clickPress == 10) { // Quit
            setButtons([]);
            stateRound = ROUND_STATES.RESET;
            stateMain = MAIN_STATES.TITLE;
        }
        
        clkDel = 0.5; //reset click delay
    }
    // Reset buttons
    clickPress = false;
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].checkHover(false);
    }
}

function getTopCard(arr) {
    let topI = 0;
    for(let i = 0; i++; i<arr.length-1){
        if(arr[i] != null){
            if(arr[i].getRank > topI) {
                topI = i;
            }
        }
    }
    return topI;
}
// Shuffle given card, in index, to final spot in array
function shuffleCardToTop(array, index) {
    // Remove card at index
    const selectedCard = array.splice(index, 1)[0];
    // Add card back to top of stack with push        
    array.push(selectedCard);

    resetSlots(array);

    if(debug) { recalcDebugArrays(); }
}

function resetSlots(array) {
    // Set slot position to final in array
    for (let i = 0; i < array.length; i++) {
        if(array[i] != null) {
            array[i].setsP(cardASlots[i]);
        }
    }
}
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
    currentHeld = null;
    if(debug) { recalcDebugArrays(); }
}

// Tracks when to decrement deck size
function dealCardCheck() {
    quaterTrack++;
    // Deck shrink check
    if(quaterTrack >= quater) {
        quaterTrack = 0; //reset
        dOffset -= 0.008; //shadow render offset
        removeCardFromArray(deckStack, deckStack.length-1);
    }
}

// Transfers cards from cardGenQUEUE to Player/Opponent
function cardTransferArray(choose) {
    if(choose) {
        if(cardGenQueueA.length > 0) {
            // Add the card to the playerCardHand
            playerCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            // Set card position in hand
            playerCardHand[playerCardHand.length-1].setsP(cardASlots[playerCardHand.length-1]);
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            // Update card stats
            cardNum++;
            deckTotal--;
            zzfx(...[.6,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
            dealCardCheck()
        }
    } else {
        if(cardGenQueueA.length > 0) {
            // Add the card to the opponentCardHand
            opponentCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            // Set card position in hand
            opponentCardHand[opponentCardHand.length-1].setsP(cardBSlots[opponentCardHand.length-1]);
            opponentCardHand[opponentCardHand.length-1].flipCard();
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            // Update card stats
            cardNum++;
            deckTotal--;
            zzfx(...[.6,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
            dealCardCheck()
        }
    }
}

function checkHoverArea(x, y, dx, dy) {
    return (mouseX >= w*x && mouseX <= (w*x) + w*dx 
    && mouseY >= h*y && mouseY <= (h*y) + h*dy);
    // return (mouseX >= width*x && mouseX <= (width*x) + dx 
    // && mouseY >= height*y && mouseY <= (height*y) + dy);
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
