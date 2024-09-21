function checkButtonClicks() {
    if(clickPress != false && clkDel <= 0) {
        if(clickPress == 1) { // START
            setButtons([]);
            stateMain = MAIN_STATES.GR;
        } else if (clickPress == 2) { // OPTIONS
            setButtons([]);
            stateMain = MAIN_STATES.O;
        } else if (clickPress == 3) { // CREDITS
            setButtons([]);
            stateMain = MAIN_STATES.C;
        } else if (clickPress == 4) { // BACKtoTitle
            setButtons([]);
            stateMain = MAIN_STATES.T;
        } else if (clickPress == 5) { // Continue
            setButtons([10]);
            if(stateRound == ROUND_STATES.I) {
                stateRound = ROUND_STATES.D;
                txtBoxB = false;
            } else if(stateRound == ROUND_STATES.D) {
                stateRound = ROUND_STATES.P;
            }
        } else if (clickPress == 6) { // Next
            setButtons([10]);
            stateRound = ROUND_STATES.N;
        } else if (clickPress == 7) { // Replay - Continue
            
            // Defeat Enemy
            if(scoreTot > needs) {
                console.log("OPPONENT DEFEATED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                
                if(walletMM && !ownedNFTs.includes(game+1)) {
                    console.log("Requesting badge for opponent " + game);
                    opponentDefeated(walletMM, game+1);
                } else {
                    console.log("No badge command requested, either no wallet connected, or player has already recieved this badge");
                }
                enemyD = true;
                setButtons([23])
                zzfx(...[2.2*mVo,,366,.1,.27,,1,1.1,,-25,291,.06,.05,.3,42,.2,.17,.53,.13,.36]); // Powerup 972
            }

            setButtons([10]); // Disable all buttons
            stateRound = ROUND_STATES.PO;

            // Start Game Sfx
            zzfx(...[.6*mVo,0,65.40639,.11,.76,.41,1,.7,,,,,.31,,,,,.55,.05,.42]);
    
        } else if (clickPress == 8) { // Title
            setButtons([]);
            stateRound = ROUND_STATES.R;
            stateMain = MAIN_STATES.T;
        } else if (clickPress == 9) { // Wallet Connect
            if(walletMM == null) {
                connectWallet();
            } else {
                disconnectWallet();
            }
        } else if (clickPress == 10) { // Quit
            setButtons([]);
            resetALL(1); // hard reset
            stateRound = ROUND_STATES.R;
            stateMain = MAIN_STATES.T;
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
        } else if (clickPress == 21) { // Start turn
            setButtons([]);
            stateRound = ROUND_STATES.I;
        } else if (clickPress == 22) { // Next turn (cont from POST)
            resetALL(0);
            setButtons([10,21]);
            stateRound = ROUND_STATES.PRE;
        
        } else if (clickPress == 23) { // NEXT OPPONENT
            game++; // increment game
            if(handSize < 5) {
                handSize++; 
            }
            resetALL(0);
            setButtons([10,21]);
            round = 1;
            stateRound = ROUND_STATES.PRE;
        } else if (clickPress == 24) { // PFP
            opponentDefeated(0, null); //test call server
        }
        
        zzfx(...[1.2*mVo,,9,.01,.02,.01,,2,11,,-305,.41,,.5,3.1,,,.54,.01,.11]); // click
        clkDel = .5; //reset click delay
    }
    // Reset buttons
    clickPress = false;
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].checkHover(false);
    }
}
