/////////////////////////////////////////////////////
// r Functions
/////////////////////////////////////////////////////

function rGame(timestamp) {

    // Blue background
    // cx.fillStyle = '#334';
    cx.fillStyle = c7;
    cx.fillRect(0, 0, w2, h2);

    if (stateRound != ROUND_STATES.PO && stateRound != ROUND_STATES.PRE) {
        rGameMain();

    } else if (stateRound == ROUND_STATES.PRE) {
        cx.fillStyle = '#111';
        cx.fillRect(0, 0, w2, h2);
        rGamePRE();
    } else if (stateRound == ROUND_STATES.PO) {
        cx.fillStyle = '#222';
        cx.fillRect(0, 0, w2, h2);
        rGamePOST();
    }

    if(!tut) {
        rButtons();
    }
}

function rGameMain() {
    g(1);
    uiS[1].r();


    g(.8);
    
    rBacking();

    drawNPC(npcOp.lvl, .407, .016);
    
    // g(1.0;
    // Draw Deck stack
    for (let i = 0; i < deckStack.length; i++) {
        if(deckStack[i] != null) {
            deckStack[i].r();
        }
    }   
    // Draw Table A Cards
    for (let i = 0; i < tableCardHoldA.length; i++) {
        if(tableCardHoldA[i] != null) {
            tableCardHoldA[i].r();
        }
    }
    // Draw Table B Cards
    for (let i = 0; i < tableCardHoldB.length; i++) {
        if(tableCardHoldB[i] != null) {
            tableCardHoldB[i].r();
        }
    }

    // Draw Player B Cards
    for (let i = 0; i < opponentCardHand.length; i++) {
        if(opponentCardHand[i] != null) {
            opponentCardHand[i].r();
        }
    }
    // Draw Player A Cards
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].r();
        }
    }
    if(stateRound == ROUND_STATES.P) {// Tutorial helper
        if(first) { 
            uiT[66].r();
        }
    }
    if(tut) {
        first = false; // end tutorial message
        dB(0, .14, w, .73, '#000000DD'); //tutorial backing
        dB(.022, .38, .118, .24, '#99555580'); // discard
        dB(.862, .38, .118, .24, '#7755CC88'); // Deck
        uiT[51].r();
        uiT[52].r();
        uiT[53].r();
        uiT[54].r();
        uiT[55].r();
        uiT[56].r();
        uiT[57].r();
        uiT[58].r();
        uiT[59].r();
        uiT[67].r();
        uiT[68].r();
        for (let i = 0; i < deckStack.length; i++) {
            if(deckStack[i] != null) {
                deckStack[i].r();
            }
        }   
        rSuits(.62, .5, 1);
        rSuits(.67, .5, 3);
        rSuits(.72, .5, 2);
        rSuits(.77, .5, 0);
        if(deckActive) {
            dB(.862, .38, .118, .24, '#111111BB'); // deck hover
        }
    }
    
    // r end of round
    g(1);
    if(roundEnd) { //blackout area
        dB(0, 0, w, h, '#000000CF');
        if(playerWin[0] == 1) { // WIN
            dB(.33, .51, .33, .07, c4);
            uiT[7].r(); // LOSS
        } else if (playerWin[0] == -1) {
            dB(.32, .51, .36, .07, c6);
            uiT[8].r();
        } else if (playerWin[0] == 0) { // DRAW
            dB(.35, .51, .27, .07, c7);
            uiT[19].r();

        }
        uiT[6].r();    
    }
    // Draw text boxes
    if(txtBoxB) {
        rTextBoxB();
    }
}
function rGamePRE() {
    for(let i = 31; i<35; i++) {
        uiT[i].r(); // OBJECTIVES
    }    
    uiT[44].r(); // Opponent
    uiT[45].r(); 
    uiT[46].r(); 
    uiT[47].r(); 
    uiT[69].r(); // round needed

    drawNPC(npcOp.lvl, .65, .65);
    
    g(.2);
    uiT[35].r();
    uiT[36].r();
    uiT[37].r();
    uiT[38].r();
    uiT[39].r();
    uiT[40].r();
    uiT[41].r();
    uiT[42].r(); 
    uiT[43].r(); 
}
function rGamePOST() {
    
    if(enemyD) {
        drawPOST();
    } else if((round >= roundMax)) { // game over
        cx.fillStyle = 'cc111199'; // red
        cx.fillRect(0, 0, w2, h2);
        uiT[50].r(); // Game over
        uiT[79].updateSTR('YOUR SCORE: ' + scoreTot); // Game over
        uiT[79].r(); // Game over
    } else { 
        drawPOST();
    }
}

function drawPOST() {
    // WON / LOST / CONTINUE
// if(game == 0) {
    uiT[48].r(); // ROUND END
    
    uiT[60].r(); // Round stats
    uiT[61].r(); // 
    uiT[62].r(); // 
    uiT[63].r(); // 
    uiT[64].r(); // 
    uiT[65].r(); // 
    

    uiT[77].r(); // mystery card
    dB(.73, .11, .2, .45, '#333344EE');
    
    drawNPC(npcOp.lvl, .65, .65);
    if(enemyD) { // enemy defeated
        dB(.73, .11, .2, .45, '#cc444477');
        dB(.65, .65, .07, .14, '#cc4444AA');
        
        uiT[78].r(); // OP DEFEATED
        uiT[77].r(); // mystery card
        
        uiS[18].r(); // Skull
    }
}

let yI = -.0004;
let yW = 0;
// r text box B - Opponent
function rTextBoxB() {

    yW += yI;
    if(yW >= .01) {
        yI = -.0004;
    } else if (yW < -.01) {
        yI = .0004;
    }
    
    g(.4);
    dB(.485, .065+yW, .495, .13, c6); //outer highlight
    g(1);
    if(playerWin[0] == 1) {
        dB(.49, .08+yW, .48, .1, '#944'); //grey red pad
    } else {
        dB(.49, .08+yW, .48, .1, c4); //grey pad
    }
    dO(.49, .08+yW, .48, .1, 0);

    g(.8);
    cx.font = "normal bold 22px monospace";
    cx.fillStyle = '#FFFFFF';

    txtBoxBtxt.y = txtBoxPos.y+yW;
    txtBoxBtxt.r();
}

function g(a) {
    cx.globalAlpha=a;
}

function rBacking() {
    g(1);
    // Middle grey box
    g(.2);
    dB(0, .18, w, .64, c4);
    g(.5);
    dB(0, .22, w, .56, c3);
    g(1);
    // Middle dark boxes
    dB(.1, .24, .8, .52, '#001');
    dB(.015, .26, .970, .48, '#001');// Edge L grey
    // Center Purple
    dB(.115, .27, .77, .46, c5);
    dB(.115, .49, .77, .01, c7); //divider
    dO(.115, .27, .77, .46, 1);

    // Score Array
    dB(.8, .3, .05, .40, c7);
    dB(.805, .32, .04, .36, '#112');
    g(.9*(round/roundMax));
    dB(.816, .325, .021, .35*(round/roundMax), c6); //marker
    g(1);
    
    // Hover table
    if(tableActive) {
        dB(.115, .5, .77, .23,'#66666677');
    }

    // DSC
    dB(.03, .3, .1, .40, c7);
    g(.2);
    dB(.022, .38, .118, .24, c6);
    if(dscActive) {
        g(.35);
        dB(.022, .38, .118, .24, c6);
    }
    g(.8);
    dO(.03, .3, .1, .40, 1);
    g(.3);
    rFont(.07, .41, w, h, 2.25, fntW, [3])
    rFont(.07, .475, w, h, 2.25, fntW, [18])
    rFont(.07, .54, w, h, 2.25, fntW, [2])
    g(1);
    
    // Game STATS
    uiT[18].r(); // GAME I
    uiT[70].r();
    uiT[71].r();
    uiT[72].r();
    uiT[73].r();
    g(.4);
    uiT[76].r(); //discards
    g(1);

    // DCK Pad
    dB(.87, .3, .1, .40, c7);
    dB(.862, .38, .118, .24, '#6345A050');
    if(deckActive && !currentHeld) {
        dB(.862, .38, .118, .24, '#7755CCDD');
    }
    dO(.87, .3, .1, .40, 1);

    // DCK Shadow
    dB(.855-dOffset, .414, .095+dOffset, .217+(dOffset*1.2), '#00000065');
    
    // Player Hand
    if(handActive) {
        dB(.2, .85, .6, .2, '#66666677');
    } else {
        dB(.2, .85, .6, .2, c3);
    }
    dO(.22, .88, .56, .2, 1);
    
    // Opponent Hand
    dB(.5, 0, .4, .15, c3);
    dO(.515, -.018, .37, .15, 1);
    
    // Opponent Box
    dB(.40, 0, .08, .16, '#001');
    dB(.407, .016, .065, .13, c1);

    // Player Hand Highlight
    if(highlight >= .025) {
        highlight -= .025;
        g(highlight);
        dB(.2, .85, .6, .2, '#33AAEE');
        g(1.0);
    }
    
    g(1); // hand max
    uiT[80].r();
    g(1);
    // Round & Round Number Highlight
    g(.13);
    uiT[16].r();
    if(highlightR >= .05) {
        highlightR -= .05;
        g(highlightR);
    } else {
        g(.13);
    }
    
    uiT[17].r();
    g(1);
}

function loadingScreen(timestamp) {
    let calcPer = Math.ceil((loadPer/maxPer)*100);
    
    // Initial flash effect on load
    cx.fillStyle = c4;
    cx.fillRect(0, 0, cvs.width, cvs.height);
    
    g(.7);
    cx.fillStyle = c0;
    cx.font = "normal bold 32px monospace";
    
    if(calcPer >= 100) {
        cx.fillText("LOADING... 100%" , .07*w, .9*h);
        if(!loaded) {
            loaded = true;
            setTimeout(() => {
                stateMain = MAIN_STATES.T;
            }, 1000);
            console.log("LOADED == TRUE");
        }
    } else {
        cx.fillText("LOADING... " + calcPer +"%" , .07*w, .9*h);
    }
    
    g(1);
}

function rTitle(timestamp) {
    g(1);
    // dB(0, 0, w, h, '#558'); //background
    dB(0, 0, w, h, '#4F4F7F'); //background
    // dB(0, 0, w, h, c4); //background
    
    g(.15);
    uiS[1].r();

    //Achievements - Under
    for (let i=5; i<9; i++) {
        g(.4);
        uiS[i].r();

    }

    g(.8);
    if(tCard) {
        tCard.r();
    }

    rButtons();
    
    // AVAX Button
    dB(.415, .78, .055, .1, '#CCC'); //button outer
    dB(.418, .787, .047, .085, '#F55'); //red frame
    dB(.426, .808, .028, .038, '#FDD'); //white center
    // Wallet AVAX Sprite r
    uiS[0].r();

    // Draw title Cards
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            titleCds[i].r();
        }
    }
    // dB(0, .07, w, .30, '#27274477'); //title
    g(.6);
    dB(0, 0, w, .36, c5); // title banner
    dB(0, .91, w, .1, c5); // base banner
    
    // Title Text 
    g(.8);
    
    rSuits(.05, .22, 1);
    rSuits(.15, .22, 3);
    rSuits(.81, .22, 2);
    rSuits(.91, .22, 0);
    // uiT[0].r();
    uiT[28].r();
    uiT[29].r();
    uiT[30].r();
    // Wallet info / highlight
    uiT[11].r();

    g(.25);
    // Debug
    if(mobile) {
        uiT[10].r();
    } else {
        uiT[9].r();
    }

    if(highlight >= .02) {
        highlight -= .02;
    }
    g(highlight);
    dB(0, .91, w, .1, c0); // base banner
    // dB(.04, .91, .91, .05, c0);

    // cx.font = "normal bold 22px monospace";
    // cx.fillText("TITLE", .45*w, .25*h);
    
}

function rOptions(timestamp) {
    g(.8);
    dB(0, 0, w, h, c3); //bg
    
    g(.1);
    uiS[1].r();
    g(.8);

    uiT[2].r();
    uiT[20].r();
    uiT[21].r();
    uiT[22].r();
    uiT[23].r();

    rButtons();
}
function rCredits(timestamp) {
    g(.8);
    dB(0, 0, w, h, '#424'); //bg

    g(.4);
    uiS[1].r();
    g(.8);

    uiT[3].r();
    uiT[4].r();
    uiT[5].r();
    uiT[12].r();
    uiT[13].r();
    uiT[15].r();
    
    uiT[24].r();

    rButtons();
}

function rDebug() {
    // Blue background
    cx.fillStyle = '#448';
    cx.fillRect(w*.125, 0, w2, h2);
    cx.fillStyle = '#AAF';
    // Test markers
    cx.fillRect(w*.125, .1*h2, w2*.01, 10);
    cx.fillRect(w*.125, .2*h2, w2*.01, 10);
    cx.fillRect(w*.125, .5*h2, w2*.01, 10);
    cx.fillRect(w*.125, .8*h2, w2*.01, 10);
    cx.fillRect(w*.125, .9*h2, w2*.01, 10);
    
    // Text
    cx.font = "normal bold 26px monospace";
    cx.fillText("JS13K", .16*w, .13*h);
    
    cx.fillStyle = '#113';
    if(mobile) {
        cx.fillText("[MOBILE]", .25*w, .13*h);
    } else {
        cx.fillText("[BROWSER]", .25*w, .13*h);
    }
    
    // Draw Player A Cards
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].r();
        }
    }   
}

// Draw all buttons
function rButtons() {
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].r();
        uiB[i].checkHover(mouseX, mouseY);
    }
    // console.log("ring buttons: ");
}

function debugMouse() {
    g(1);
    dB((mouseX/w)-.01, (mouseY/h)-.02, .02, .04, '#22AAFF50');
}