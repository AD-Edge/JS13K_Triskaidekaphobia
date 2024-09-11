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

            if(debug) { recalcDebugArrays(); recalcStats(); }
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
            setButtons([4, 11,12,13,14,15,16,17,18,19,20]);

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
            zzfx(...[0.6*mVo,0,65.40639,.11,.76,.41,1,.7,,,,,.31,,,,,.55,.05,.42]);
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
            zzfx(...[0.75*mVo,,37,.06,.01,.36,3,1.8,,,,,,.4,63,.4,,.38,.14,.12,-1600]);
            setTimeout(() => {
                let ch = npcOp.makeMove();
                if(ch == 1) { // Deal Card to table
                    // let topCard = getTopCard(opponentCardHand);
                    // moveCardToArray([opponentCardHand, topCard[0]], tableCardHoldB);
                    // tableCardHoldB[tableCardHoldB.length-1].setsP(tableBSlots[tableCardHoldB.length-1]);
                    // tableCardHoldB[tableCardHoldB.length-1].flipCard(false);
                    // tableCardHoldB[tableCardHoldB.length-1].setSettled(false);
                    // zzfx(...[.2*mVo,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); // pickup quick

                    
                } else if(ch == 2) { // Discard Card
                    // opponentCardHand[0].setsP(dscPos);
                    // opponentCardHand[0].setSettled(false);
                    // zzfx(...[.2*mVo,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); // pickup quick
                    // setTimeout(() => {
                    //     moveCardToArray([opponentCardHand, 0], dscQueue)
                    //     zzfx(...[.8*mVo,,81,,.07,.23,3,3,-5,,,,,.1,,.5,,.6,.06,,202]); // Hit Discard
                    //     discarded++;
                    // }, 800);
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
            // Reset text for end condition
            if(playerWin == 1) { // WIN
                txtBoxBtxt.updateSTR(npcOp.getRandomTxt(3));
            } else if (playerWin == -1 || playerWin == 0){ // LOSS
                txtBoxBtxt.updateSTR(npcOp.getRandomTxt(2));
            }
            setTimeout(() => {
                txtBoxB = true;
                // Speech sfx
                zzfx(...[,.3*mVo,138,,.03,.03,3,1.8,-18,,2,.04,,.1,16,,,.62,.03]);
            }, 900);
            setTimeout(() => {
                zzfx(...[1.2*mVo,,9,.01,.02,.01,,2,11,,-305,.41,,.5,3.1,,,.54,.01,.11]); // click
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
            chooseA = true;
            round = 1;
            uiT[16].updateSTR('ROUND ' + round + ' OF ' + roundMax);
            uiT[17].updateSTR(round);
            playerWin = false;
            // Game State reset
            cardNum = 0;
            deckTotal = 52;
            discarded = 0;
            quaterTrack = 0;
            dOffset = 0;
            newDeckStack();
            // Reset card arrays
            currentHeld = null;
            playerCardHand = [];
            opponentCardHand = [];
            tableCardHoldA = [];
            tableCardHoldB = [];
            cardGenQueueA = [];
            dscQueue = [];

            oHigh = -1;
            oTwoP = false;
            oDups = [];
            oFlsh = ['x','x','x','x'];
            oStrt = [];
            
            pHigh = -1;
            pTwoP = false;
            pDups = [];
            pFlsh = 0;
            pStrt = [];

            npcOp = null;

            // if(debug) {removeDebug();}
            if(debug) {recalcDebugArrays(); recalcStats();}
            
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
            npcOp = new npc('00', 'Lab00', 0, null, 2);
            // Get new intro text
            txtBoxBtxt = new uix(1, txtBoxPos.x, txtBoxPos.y, 1.5, 0, null, npcOp.getRandomTxt(0) , null);
            initRound = false;
        }
        // Start round with speech text
        if(roundStart) {
            setTimeout(() => {
                txtBoxB = true;
                // Speech sfx
                zzfx(...[,.3*mVo,138,,.03,.03,3,1.8,-18,,2,.04,,.1,16,,,.62,.03]);
            }, 500);
            setTimeout(() => {
                setButtons([5, 10]);
            }, 1000);
            roundStart = false;
        }
    } else if (stateRound == ROUND_STATES.DEAL) {
        // Count cards in players hands
        let cardCount = playerCardHand.length + opponentCardHand.length;
        // Generate new cards as needed 
        // If all cards are delt out, toggle to play
        if(cardCount >= handSize*2) {
            setTimeout(() => {
                resetSlotPositions(cardASlots, playerCardHand);
                resetSlotPositions(cardBSlots, opponentCardHand);
                resetSlotPositions(tableBSlots, tableCardHoldB);
                // resetSlotPositions(tableASlots, tableCardHoldA);

                if(debug) { recalcDebugArrays(); recalcStats(); }

                stateRound = ROUND_STATES.PLAY;
            }, 600);
        } else {
            setTimeout(() => {
                const delayBetweenCards = 160; // 500ms delay between cards
                // if(chooseA) {
                if(timestamp - lastCardCreationTime >= delayBetweenCards) {
                    // console.log("playerCardHand: " + playerCardHand.length);
                    // console.log("opponentCardHand: " + opponentCardHand.length);
                    if(chooseA) {
                        // console.log("TIMER A");
                        if(playerCardHand.length < handSize) {
                            generateCardsFromDeck(1);
                            cardTransferArray(true);
                        }
                        chooseA = false;   
                    } else {
                        // console.log("TIMER B");
                        if(opponentCardHand.length < handSize) {
                            generateCardsFromDeck(1);
                            cardTransferArray(false);
                        }
                        chooseA = true;
                    }
                    lastCardCreationTime = timestamp;
                    if(debug) { recalcDebugArrays();}
                }
            }, 300);
        }
    } else if (stateRound == ROUND_STATES.PLAY) {
        
    // card bop 
    if(bop > 0) {
        bop -= 0.02;
    } else {
        setTimeout(() => {
            if(playerCardHand[0] != null) {
                let ck = checkClose(playerCardHand[0].getsP(), playerCardHand[0].getPos());
                if(!ck) {
                    playerCardHand[0].pos.y -= 0.02;
                    playerCardHand[0].setSettled(false);}
                // console.log("pos: " + playerCardHand[0].getPos().y);
                // console.log("sP: " + playerCardHand[0].getsP().y);
                // console.log("pos: " + playerCardHand[0].getPos().y);
            }
        }, 200);
        setTimeout(() => {
            if(playerCardHand[1] != null) {
                let ck = checkClose(playerCardHand[1].getsP(), playerCardHand[1].getPos());
                if(!ck) {
                    playerCardHand[1].pos.y -= 0.02;
                    playerCardHand[1].setSettled(false);}
            }
        }, 400);
        setTimeout(() => {
            if(playerCardHand[2] != null) {
                let ck = checkClose(playerCardHand[2].getsP(), playerCardHand[2].getPos());
                if(!ck) {
                    playerCardHand[2].pos.y -= 0.02;
                    playerCardHand[2].setSettled(false);}
            }
        }, 600);
        setTimeout(() => {
            if(playerCardHand[3] != null) {
                let ck = checkClose(playerCardHand[3].getsP(), playerCardHand[3].getPos());
                if(!ck) {
                    playerCardHand[3].pos.y -= 0.02;
                    playerCardHand[3].setSettled(false);}
            }
        }, 800);
        setTimeout(() => {
            if(playerCardHand[4] != null) {
                let ck = checkClose(playerCardHand[4].getsP(), playerCardHand[4].getPos());
                if(!ck) {
                    playerCardHand[4].pos.y -= 0.02;
                    playerCardHand[4].setSettled(false);}
            }
        }, 1000);
        
        //Reset
        bop = 4;
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
    let hovC = checkHoverArea(.862, .38, .118, .24,)
    if(hovC) {
        deckActive = true;
    } else {
        deckActive = false;
    }

    } else if (stateRound == ROUND_STATES.NEXT) {
        
        if(initNext) {
            round++;
            uiT[16].updateSTR('ROUND ' + round + ' OF ' + roundMax);
            uiT[17].updateSTR(round);
            highlightR = 1.0;
            // Console.log("generate next cards: ");
            if (round <= roundMax) {
                // if((cardCount) < handSize*2 ) {
                //     generateCardsFromDeck((handSize*2) - cardCount);
                // }
                // Selects who gets a card first for order sake
                if(playerCardHand.length <= opponentCardHand.length) {
                    chooseA = true;
                } else {
                    chooseA = false;
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

}

function checkClose(pos1, pos2) {
    let distance = Math.sqrt(
        Math.pow(pos2.x - pos1.x, 2) +
        Math.pow(pos2.y - pos1.y, 2) );
    console.log("distance: " + distance);
    console.log(distance > 0.02);
    return distance > 0.02;
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
        zzfx(...[.3*mVo,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
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
                    //shuffle card order
                    let inx = shuffleCardToTop(playerCardHand, i)
                    currentHeld = [playerCardHand, inx];
                    // Pickup quick sfx
                    zzfx(...[.2*mVo,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
                    // console.log("currentHeld: " + currentHeld );
                    return;
                }
            }
        }
        for (let i = tableCardHoldA.length; i >= 0; i--) {
            if(tableCardHoldA[i] != null && currentHover != null) {
                var click = tableCardHoldA[i].checkClick(true);
                if(click) {
                    //shuffle card order
                    let inx = shuffleCardToTop(tableCardHoldA, i)
                    currentHeld = [tableCardHoldA, inx];
                    // Pickup quick sfx
                    zzfx(...[.2*mVo,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
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
                    zzfx(...[.2*mVo,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
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
        zzfx(...[.3*mVo,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
        
        if(stateRound == ROUND_STATES.PLAY) {
            if(tableActive) {
                moveCardToArray(currentHeld, tableCardHoldA)
                currentHeld = null;
            } else if(handActive) {
                moveCardToArray(currentHeld, playerCardHand)
                currentHeld = null;
            } else if(dscActive) {
                zzfx(...[.8*mVo,,81,,.07,.23,3,3,-5,,,,,.1,,.5,,.6,.06,,202]); // Hit Discard
                discarded++;
                moveCardToArray(currentHeld, dscQueue)
                currentHeld = null;
            }
        }
        // Reset currentHeld to nothing
        currentHeld = null;
        // console.log("Current held reset");
    }
}

function checkButtonClicks() {
    if(clickPress != false && clkDel <= 0) {
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
            zzfx(...[0.6*mVo,0,65.40639,.11,.76,.41,1,.7,,,,,.31,,,,,.55,.05,.42]);
    
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
        } else if (clickPress == 11) { // Volume Off
            mVo = 0;
            resetCmV();
            uiB[11].updateCOL(c6);
        } else if (clickPress == 12) { // 25%
            mVo = .25;
            resetCmV();
            uiB[12].updateCOL(c6);
        } else if (clickPress == 13) { // 50%
            mVo = .5;
            resetCmV();
            uiB[13].updateCOL(c6);
        } else if (clickPress == 14) { // 75%
            mVo = .75;
            resetCmV();
            uiB[14].updateCOL(c6);
        } else if (clickPress == 15) { // 100%
            mVo = 1;
            resetCmV();
            uiB[15].updateCOL(c6);
        } else if (clickPress == 16) { // Volume Off
            uVo = 0;
            resetCmM();
            uiB[16].updateCOL(c6);
        } else if (clickPress == 17) { // 25%
            uVo = .25;
            resetCmM();
            uiB[17].updateCOL(c6);
        } else if (clickPress == 18) { // 50%
            uVo = .5;
            resetCmM();
            uiB[18].updateCOL(c6);
        } else if (clickPress == 19) { // 75%
            uVo = .75;
            resetCmM();
            uiB[19].updateCOL(c6);
        } else if (clickPress == 20) { // 100%
            uVo = 1;
            resetCmM();
            uiB[20].updateCOL(c6);
        }
        
        zzfx(...[1.2*mVo,,9,.01,.02,.01,,2,11,,-305,.41,,.5,3.1,,,.54,.01,.11]); // click
        clkDel = 0.5; //reset click delay
    }
    // Reset buttons
    clickPress = false;
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].checkHover(false);
    }
}

function resetCmV() {
    uiB[11].updateCOL(c5);
    uiB[12].updateCOL(c5);
    uiB[13].updateCOL(c5);
    uiB[14].updateCOL(c5);
    uiB[15].updateCOL(c5);
}
function resetCmM() {
    uiB[16].updateCOL(c5);
    uiB[17].updateCOL(c5);
    uiB[18].updateCOL(c5);
    uiB[19].updateCOL(c5);
    uiB[20].updateCOL(c5);
}

function resetSlotPositions(positions, array) {
    for(let i=0; i < array.length; i++) {
        array[i].setsP(positions[i]);
        array[i].setSettled(false);
    }
}
function unSettleNewCard(positions, array) {
    let i = array.length-1;
    array[i].setsP(positions[i]);
    array[i].setSettled(false);
}

// Shuffle given card, in index, to final spot in array
function shuffleCardToTop(array, index) {
    // Remove card at index
    const selectedCard = array.splice(index, 1)[0];
    // Add card back to top of stack with push        
    array.push(selectedCard);

    // resetSlots(array);

    if(debug) { recalcDebugArrays(); }
    return array.length-1;
}

// function resetSlots(array) {
//     // Set slot position to final in array
//     for (let i = 0; i < array.length; i++) {
//         if(array[i] != null) {
//             array[i].setsP(cardASlots[i]);
//         }
//     }
// }
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
            unSettleNewCard(cardASlots, playerCardHand);
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            // Update card stats
            cardNum++; deckTotal--;
            zzfx(...[.6*mVo,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
            dealCardCheck()
        }
    } else {
        if(cardGenQueueA.length > 0) {
            // Add the card to the opponentCardHand
            opponentCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            opponentCardHand[opponentCardHand.length-1].flipCard(true);
            unSettleNewCard(cardBSlots, opponentCardHand);
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            // Update card stats
            cardNum++; deckTotal--;
            zzfx(...[.6*mVo,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
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
