/////////////////////////////////////////////////////
// r Functions
/////////////////////////////////////////////////////

function renderGame(timestamp) {
    // Blue background
    // cx.fillStyle = '#334';
    cx.fillStyle = c7;
    cx.fillRect(0, 0, w2, h2);

    if (stateRound != ROUND_STATES.PO && stateRound != ROUND_STATES.PRE) {
        renderGameMain();

    } else if (stateRound == ROUND_STATES.PRE) {
        cx.fillStyle = '#111';
        cx.fillRect(0, 0, w2, h2);
        renderGamePRE();
    } else if (stateRound == ROUND_STATES.PO) {
        cx.fillStyle = '#222';
        cx.fillRect(0, 0, w2, h2);
        renderGamePOST();
    }

    if(!tut) {
        renderButtons();
    }
}

function renderGameMain() {
    g(1);
    uiS[1].render();
    g(.8);
    
    renderBacking();

    drawNPC(npcOp.lvl, .407, .016);
    
    // g(1.0;
    // Draw Deck stack
    for (let i = 0; i < deckStack.length; i++) {
        if(deckStack[i] != null) {
            deckStack[i].render();
        }
    }   
    // Draw Table A Cards
    for (let i = 0; i < tableCardHoldA.length; i++) {
        if(tableCardHoldA[i] != null) {
            tableCardHoldA[i].render();
        }
    }
    // Draw Table B Cards
    for (let i = 0; i < tableCardHoldB.length; i++) {
        if(tableCardHoldB[i] != null) {
            tableCardHoldB[i].render();
        }
    }

    // Draw Player B Cards
    for (let i = 0; i < opponentCardHand.length; i++) {
        if(opponentCardHand[i] != null) {
            opponentCardHand[i].render();
        }
    }
    // Draw Player A Cards
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].render();
        }
    }
    if(stateRound == ROUND_STATES.P) {// Tutorial helper
        if(first) { 
            uiT[66].render();
        }
    }
    if(tut) {
        first = false; // end tutorial message
        drawBox(0, .14, w, .73, '#000000DD'); //tutorial backing
        drawBox(.022, .38, .118, .24, '#99555580'); // discard
        drawBox(.862, .38, .118, .24, '#7755CC88'); // Deck
        uiT[51].render();
        uiT[52].render();
        uiT[53].render();
        uiT[54].render();
        uiT[55].render();
        uiT[56].render();
        uiT[57].render();
        uiT[58].render();
        uiT[59].render();
        uiT[67].render();
        uiT[68].render();
        for (let i = 0; i < deckStack.length; i++) {
            if(deckStack[i] != null) {
                deckStack[i].render();
            }
        }   
        renderSuits(.62, .5, 1);
        renderSuits(.67, .5, 3);
        renderSuits(.72, .5, 2);
        renderSuits(.77, .5, 0);
        if(deckActive) {
            drawBox(.862, .38, .118, .24, '#111111BB'); // deck hover
        }
    }
    
    // r end of round
    g(1);
    if(roundEnd) { //blackout area
        drawBox(0, 0, w, h, '#000000CF');
        if(playerWin[0] == 1) { // WIN
            drawBox(.33, .51, .33, .07, c4);
            uiT[7].render(); // LOSS
        } else if (playerWin[0] == -1) {
            drawBox(.32, .51, .36, .07, c6);
            uiT[8].render();
        } else if (playerWin[0] == 0) { // DRAW
            drawBox(.35, .51, .27, .07, c7);
            uiT[19].render();

        }
        uiT[6].render();    
    }
    // Draw text boxes
    if(txtBoxB) {
        renderTextBoxB();
    }
}
function renderGamePRE() {
    for(let i = 31; i<35; i++) {
        uiT[i].render(); // OBJECTIVES
    }    
    uiT[44].render(); // Opponent
    uiT[45].render(); 
    uiT[46].render(); 
    uiT[47].render(); 
    uiT[69].render(); // round needed

    drawNPC(npcOp.lvl, .65, .65);
    
    g(.2);
    uiT[35].render();
    uiT[36].render();
    uiT[37].render();
    uiT[38].render();
    uiT[39].render();
    uiT[40].render();
    uiT[41].render();
    uiT[42].render(); 
    uiT[43].render(); 
}
function renderGamePOST() {
    
    if(enemyD) {
        drawPOST();
    } else if((round >= roundMax)) { // game over
        cx.fillStyle = 'cc111199'; // red
        cx.fillRect(0, 0, w2, h2);
        uiT[50].render(); // Game over
        uiT[79].updateSTR('YOUR SCORE: ' + scoreTot); // Game over
        uiT[79].render(); // Game over
    } else { 
        drawPOST();
    }
}

function drawPOST() {
    // WON / LOST / CONTINUE
// if(game == 0) {
    uiT[48].render(); // ROUND END
    
    uiT[60].render(); // Round stats
    uiT[61].render(); // 
    uiT[62].render(); // 
    uiT[63].render(); // 
    uiT[64].render(); // 
    uiT[65].render(); // 
    

    uiT[77].render(); // mystery card
    drawBox(.73, .11, .2, .45, '#333344EE');
    
    drawNPC(npcOp.lvl, .65, .65);
    if(enemyD) { // enemy defeated
        drawBox(.73, .11, .2, .45, '#cc444477');
        drawBox(.65, .65, .07, .14, '#cc4444AA');
        
        uiT[78].render(); // OP DEFEATED
        uiT[77].render(); // mystery card
        
        uiS[18].render(); // Skull
    }
}

let yI = -.0004;
let yW = 0;
// r text box B - Opponent
function renderTextBoxB() {

    yW += yI;
    if(yW >= .01) {
        yI = -.0004;
    } else if (yW < -.01) {
        yI = .0004;
    }
    
    g(.4);
    drawBox(.485, .065+yW, .495, .13, c6); //outer highlight
    g(1);
    if(playerWin[0] == 1) {
        drawBox(.49, .08+yW, .48, .1, '#944'); //grey red pad
    } else {
        drawBox(.49, .08+yW, .48, .1, c4); //grey pad
    }
    drawOut(.49, .08+yW, .48, .1, 0);

    g(.8);
    cx.font = "normal bold 22px monospace";
    cx.fillStyle = '#FFFFFF';

    txtBoxBtxt.y = txtBoxPos.y+yW;
    txtBoxBtxt.render();
}

function renderBacking() {
    g(1);
    // Middle grey box
    g(.2);
    drawBox(0, .18, w, .64, c4);
    g(.5);
    drawBox(0, .22, w, .56, c3);
    g(1);
    // Middle dark boxes
    drawBox(.1, .24, .8, .52, '#001');
    drawBox(.015, .26, .970, .48, '#001');// Edge L grey
    // Center Purple
    drawBox(.115, .27, .77, .46, c5);
    drawBox(.115, .49, .77, .01, c7); //divider
    drawOut(.115, .27, .77, .46, 1);

    // Score Array
    drawBox(.8, .3, .05, .40, c7);
    drawBox(.805, .32, .04, .36, '#112');
    g(.9*(round/roundMax));
    drawBox(.816, .325, .021, .35*(round/roundMax), c6); //marker
    g(1);
    
    // Hover table
    if(tableActive) {
        drawBox(.115, .5, .77, .23,'#66666677');
    }

    // DSC
    drawBox(.03, .3, .1, .40, c7);
    g(.2);
    drawBox(.022, .38, .118, .24, c6);
    if(dscActive) {
        g(.35);
        drawBox(.022, .38, .118, .24, c6);
    }
    g(.8);
    drawOut(.03, .3, .1, .40, 1);
    g(.3);
    renderFont(.07, .41, w, h, 2.25, fntW, [3])
    renderFont(.07, .475, w, h, 2.25, fntW, [18])
    renderFont(.07, .54, w, h, 2.25, fntW, [2])
    g(1);
    
    // Game STATS
    uiT[18].render(); // GAME I
    uiT[70].render();
    uiT[71].render();
    uiT[72].render();
    uiT[73].render();
    g(.4);
    uiT[76].render(); //discards
    g(1);

    // DCK Pad
    drawBox(.87, .3, .1, .40, c7);
    drawBox(.862, .38, .118, .24, '#6345A050');
    if(deckActive && !currentHeld) {
        drawBox(.862, .38, .118, .24, '#7755CCDD');
    }
    drawOut(.87, .3, .1, .40, 1);

    // DCK Shadow
    drawBox(.855-dOffset, .414, .095+dOffset, .217+(dOffset*1.2), '#00000065');
    
    // Player Hand
    if(handActive) {
        drawBox(.2, .85, .6, .2, '#66666677');
    } else {
        drawBox(.2, .85, .6, .2, c3);
    }
    drawOut(.22, .88, .56, .2, 1);
    
    // Opponent Hand
    drawBox(.5, 0, .4, .15, c3);
    drawOut(.515, -.018, .37, .15, 1);
    
    // Opponent Box
    drawBox(.40, 0, .08, .16, '#001');
    drawBox(.407, .016, .065, .13, c1);

    // Player Hand Highlight
    if(highlight >= .025) {
        highlight -= .025;
        g(highlight);
        drawBox(.2, .85, .6, .2, '#33AAEE');
        g(1.0);
    }
    
    g(1); // hand max
    uiT[80].render();
    g(1);
    // Round & Round Number Highlight
    g(.13);
    uiT[16].render();
    if(highlightR >= .05) {
        highlightR -= .05;
        g(highlightR);
    } else {
        g(.13);
    }
    
    uiT[17].render();
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

function renderTitle(timestamp) {
    g(1);
    // drawBox(0, 0, w, h, '#558'); //background
    drawBox(0, 0, w, h, '#4F4F7F'); //background
    // drawBox(0, 0, w, h, c4); //background
    
    g(.15);
    uiS[1].render();

    //Achievements - Under
    for (let i=6; i<10; i++) {
        cx.globalAlpha = 0.4;
        uiS[i-1].render();
    }

    g(.8);
    if(tCard) {
        tCard.render();
    }

    renderButtons();
    
    // AVAX Button
    drawBox(.415, .78, .055, .1, '#CCC'); //button outer
    drawBox(.418, .787, .047, .085, '#F55'); //red frame
    drawBox(.426, .808, .028, .038, '#FDD'); //white center
    // Wallet AVAX Sprite r
    uiS[0].render();

    // Draw title Cards
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            titleCds[i].render();
        }
    }
    // drawBox(0, .07, w, .30, '#27274477'); //title
    g(.6);
    drawBox(0, 0, w, .36, c5); // title banner
    drawBox(0, .91, w, .1, c5); // base banner
    
    // Title Text 
    g(.8);
    
    renderSuits(.05, .22, 1);
    renderSuits(.15, .22, 3);
    renderSuits(.81, .22, 2);
    renderSuits(.91, .22, 0);
    // uiT[0].render();
    uiT[28].render();
    uiT[29].render();
    uiT[30].render();
    // Wallet info / highlight
    uiT[11].render();

    g(.25);
    // Debug
    if(mobile) {
        uiT[10].render();
    } else {
        uiT[9].render();
    }

    if(highlight >= .02) {
        highlight -= .02;
    }
    g(highlight);
    drawBox(0, .91, w, .1, c0); // base banner
    // drawBox(.04, .91, .91, .05, c0);

    //Achievements - Over
    for (let i=6; i<10; i++) {
        if(ownedNFTs.includes(i-4)) {
            cx.globalAlpha = 0.8;
            uiS[i-1].render();
            uiS[i+3].render();
            cx.globalAlpha = 0.2;
            uiS[i+7].render();
            
            cx.globalAlpha = 0.8;
            if(i==6) {      renderSuits(uiS[i-1].x+0.04,uiS[i-1].y+0.06, 1);}
            else if (i==7) {renderSuits(uiS[i-1].x+0.04,uiS[i-1].y+0.06, 3);}
            else if (i==8) {renderSuits(uiS[i-1].x+0.04,uiS[i-1].y+0.06, 2);}
            else if (i==9) {renderSuits(uiS[i-1].x+0.04,uiS[i-1].y+0.06, 0);}
        }
    }
    cx.globalAlpha = 1.0;
    if(walletMM) {
        uiT[74].render();
        uiT[75].render();
    }
}

function renderOptions(timestamp) {
    g(.8);
    drawBox(0, 0, w, h, c3); //bg
    
    g(.1);
    uiS[1].render();
    g(.8);

    uiT[2].render();
    uiT[20].render();
    uiT[21].render();
    uiT[22].render();
    uiT[23].render();

    renderButtons();
}
function renderPFP(timestamp) {
    g(.8);
    drawBox(0, 0, w, h, c3); //bg
    
    renderButtons();
}
function renderCredits(timestamp) {
    g(.8);
    drawBox(0, 0, w, h, '#424'); //bg

    g(.4);
    uiS[1].render();
    g(.8);

    uiT[3].render();
    uiT[4].render();
    uiT[5].render();
    uiT[12].render();
    uiT[13].render();
    uiT[15].render();
    
    uiT[24].render();

    renderButtons();
}

function renderDebug() {
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
            playerCardHand[i].render();
        }
    }   
}

// Draw all buttons
function renderButtons() {
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].render();
        uiB[i].checkHover(mouseX, mouseY);
    }
    // console.log("ring buttons: ");
}

function debugMouse() {
    g(1);
    drawBox((mouseX/w)-.01, (mouseY/h)-.02, .02, .04, '#22AAFF50');
}