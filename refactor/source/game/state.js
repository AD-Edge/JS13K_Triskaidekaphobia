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
            cvs.style.outlineColor  = '#000';
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
            console.log('ROUND_STATES.DEAL State started ...');
            stateRPrev = stateRound;
            //---------------------
            
            //---------------------
            break;
        case ROUND_STATES.NEXT:
            console.log('ROUND_STATES.NEXT State started ...');
            stateRPrev = stateRound;
            //---------------------
            
            //---------------------
            break;
        case ROUND_STATES.END:
            console.log('ROUND_STATES.END State started ...');
            stateRPrev = stateRound;
            //---------------------
            
            //---------------------
            break;

        case ROUND_STATES.RESET:
            console.log('ROUND_STATES.RESET State started ...');
            stateRPrev = stateRound;
            //---------------------
            
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

// Triggers on mouse click
function logicCheckDN() {
    let check = false;
    if(stateMain == MAIN_STATES.GAMEROUND) {
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
    } else if(stateMain == MAIN_STATES.TITLE) {
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
        currentHeld = null;

    }
}
function logicCheckCLK() {
    // Button checks
    for (let i = 1; i < uiB.length; i++) {
        let checkD = uiB[i].checkClick(true);
        if(checkD) {
            clickPress = i;
            console.log("Button clicked: " + i);
            zzfx(...[1.2,,9,.01,.02,.01,,2,11,,-305,.41,,.5,3.1,,,.54,.01,.11]); // click
        }
    }
    // Card Checks
    if(stateMain == MAIN_STATES.GAMEROUND) {
        for (let i = playerCardHand.length; i >= 0; i--) {
            if(playerCardHand[i] != null && currentHover != null) {
                var click = playerCardHand[i].checkClick(true);
                if(click) {
                    currentHeld = [playerCardHand[i], 0];

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
                    currentHeld = [titleCds[i], 0];
                    // Pickup quick sfx
                    zzfx(...[.2,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
                    return;
                }
            }
        }
    }

}
function logicCheckUP() {
    checkButtonClicks();

    // Reset buttons
    clickPress = false;
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].checkClick(false);
    }

}

function checkButtonClicks() {
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
        setButtons([]);
        if(stateRound == ROUND_STATES.INTRO) {
            stateRound = ROUND_STATES.DEAL;
            txtBoxB = false;
        } else if(stateRound == ROUND_STATES.DEAL) {
            stateRound = ROUND_STATES.PLAY;
        }
    } else if (clickPress == 6) { // Next
        setButtons([]);
        stateRound = ROUND_STATES.NEXT;
    } else if (clickPress == 7) { // Replay
        setButtons([]); // Disable all buttons
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
        stateRound = ROUND_STATES.RESET;
        stateMain = MAIN_STATES.TITLE;
    }
}