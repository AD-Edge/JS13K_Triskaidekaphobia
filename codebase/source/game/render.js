/////////////////////////////////////////////////////
// Render Functions
/////////////////////////////////////////////////////

function renderGame(timestamp) {

    // Blue background
    // cx.fillStyle = '#334';
    cx.fillStyle = c7;
    cx.fillRect(0, 0, w2, h2);

    if (stateRound != ROUND_STATES.POST && stateRound != ROUND_STATES.PRE) {
        renderGameMain();

    } else if (stateRound == ROUND_STATES.PRE) {
        cx.fillStyle = '#111';
        cx.fillRect(0, 0, w2, h2);
        renderGamePRE();
    } else if (stateRound == ROUND_STATES.POST) {
        cx.fillStyle = '#222';
        cx.fillRect(0, 0, w2, h2);
        renderGamePOST();
    }

    if(!tut) {
        renderButtons();
    }
}

function renderGameMain() {
    cx.globalAlpha = 1;
    uiS[1].render();
    cx.globalAlpha = 0.8;
    
    renderBacking();
    drawNPC(npcOp.lvl, 0.407, .016);
    
    // cx.globalAlpha = 1.0;
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
    
    // Render end of round
    cx.globalAlpha = 1;
    if(roundEnd) { //blackout area
        drawB(0, 0, w, h, '#000000CF');
        if(playerWin[0] == 1) { // WIN
            drawB(.33, .51, 0.33, 0.07, c4);
            uiT[7].render(); // LOSS
        } else if (playerWin[0] == -1) {
            drawB(.33, .51, 0.36, 0.07, c6);
            uiT[8].render();
        } else if (playerWin[0] == 0) { // DRAW
            drawB(.35, .51, 0.27, 0.07, c7);
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
    for(let i = 31; i<34+game; i++) {
        uiT[i].render(); // OBJECTIVES
    }    
    uiT[44].render(); // Opponent
    uiT[45].render(); 
    uiT[46].render(); 
    uiT[47].render(); 
    uiT[69].render(); // round needed

    drawNPC(npcOp.lvl, .65, .65);
    
    cx.globalAlpha = 0.2;
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
    } else { 
        drawPOST();
    }
}

function drawPOST() {
    // WON / LOST / CONTINUE
// if(game == 0) {
    uiT[48].render(); // ROUND END
    // uiT[49].render(); // UPGRADE - CONTINUE
    
    uiT[60].render(); // Round stats
    uiT[61].render(); // 
    uiT[62].render(); // 
    uiT[63].render(); // 
    uiT[64].render(); // 
    uiT[65].render(); // 
    

    uiT[77].render(); // mystery card
    drawB(.73, .11, .2, .45, '#333344EE');
    
    drawNPC(npcOp.lvl, .65, .65);
    if(enemyD) { // enemy defeated
        drawB(.73, .11, .2, .45, '#cc4444AA');
        drawB(.65, .65, .07, .14, '#cc4444AA');
        
        uiT[78].render(); // OP DEFEATED
        uiT[77].render(); // mystery card
    }
}

let yI = -0.0004;
let yW = 0;
// Render text box B - Opponent
function renderTextBoxB() {

    yW += yI;
    if(yW >= 0.01) {
        yI = -0.0004;
    } else if (yW < -0.01) {
        yI = 0.0004;
    }
    
    cx.globalAlpha = .4;
    drawB(.485, .065+yW, .495, .13, c6); //outer highlight
    cx.globalAlpha = 1;
    if(playerWin[0] == 1) {
        drawB(.49, .08+yW, .48, .1, '#944'); //grey red pad
    } else {
        drawB(.49, .08+yW, .48, .1, c4); //grey pad
    }
    drawO(.49, .08+yW, .48, .1, 0);

    cx.globalAlpha = .8;
    cx.font = "normal bold 22px monospace";
    cx.fillStyle = '#FFFFFF';

    txtBoxBtxt.y = txtBoxPos.y+yW;
    txtBoxBtxt.render();
}

function renderBacking() {
    cx.globalAlpha = 1;
    // Middle grey box
    cx.globalAlpha = .2;
    drawB(0, .18, w, .64, c4);
    cx.globalAlpha = .5;
    drawB(0, .22, w, .56, c3);
    cx.globalAlpha = 1;
    // Middle dark boxes
    drawB(.1, .24, .8, .52, '#001');
    drawB(.015, .26, .970, .48, '#001');// Edge L grey
    // Center Purple
    drawB(.115, .27, .77, .46, c5);
    drawB(.115, .49, .77, .01, c7); //divider
    drawO(.115, .27, .77, .46, 1);

    // Score Array
    drawB(.8, .3, .05, .40, c7);
    drawB(.805, .32, .04, .36, '#112');
    cx.globalAlpha = .9*(round/roundMax);
    drawB(.816, .325, .021, .35*(round/roundMax), c6); //marker
    cx.globalAlpha = 1;
    
    // Hover table
    if(tableActive) {
        drawB(.115, .5, .77, .23,'#66666677');
    }

    // DSC
    drawB(.03, .3, .1, .40, c7);
    cx.globalAlpha = .2;
    drawB(.022, .38, .118, .24, c6);
    if(dscActive) {
        cx.globalAlpha = .35;
        drawB(.022, .38, .118, .24, c6);
    }
    cx.globalAlpha = .8;
    drawO(.03, .3, .1, .40, 1);
    cx.globalAlpha = .3;
    renderFont(.07, .41, w, h, 2.25, fntW, [3])
    renderFont(.07, .475, w, h, 2.25, fntW, [18])
    renderFont(.07, .54, w, h, 2.25, fntW, [2])
    cx.globalAlpha = 1;
    
    // Game STATS
    uiT[18].render(); // GAME I
    uiT[70].render();
    uiT[71].render();
    uiT[72].render();
    uiT[73].render();
    cx.globalAlpha = .4;
    uiT[76].render(); //discards
    cx.globalAlpha = 1;

    // DCK Pad
    drawB(.87, .3, .1, .40, c7);
    drawB(.862, .38, .118, .24, '#6345A050');
    if(deckActive && !currentHeld) {
        drawB(.862, .38, .118, .24, '#7755CCDD');
    }
    drawO(.87, .3, .1, .40, 1);

    // DCK Shadow
    drawB(.855-dOffset, .414, .095+dOffset, .217+(dOffset*1.2), '#00000065');
    
    // Player Hand
    if(handActive) {
        drawB(.2, .85, .6, .2, '#66666677');
    } else {
        drawB(.2, .85, .6, .2, c3);
    }
    drawO(.22, .88, .56, .2, 1);
    
    // Opponent Hand
    drawB(.5, 0, .4, .15, c3);
    drawO(.515, -0.018, .37, .15, 1);
    
    // Opponent Box
    drawB(.40, 0, .08, .16, '#001');
    drawB(.407, 0.016, .065, .13, c1);

    // Player Hand Highlight
    if(highlight >= 0.025) {
        highlight -= 0.025;
        cx.globalAlpha = highlight;
        drawB(.2, .85, .6, .2, '#33AAEE');
        cx.globalAlpha = 1.0;
    }
    
    // Round & Round Number Highlight
    cx.globalAlpha = 0.13;
    uiT[16].render();
    if(highlightR >= 0.05) {
        highlightR -= 0.05;
        cx.globalAlpha = highlightR;
    } else {
        cx.globalAlpha = 0.13;
    }
    uiT[17].render();

    cx.globalAlpha = 1;
    
    if(stateRound == ROUND_STATES.PLAY) {// Tutorial helper
        if(first) { 
            uiT[66].render();
        }
    }
    if(tut) {
        first = false; // end tutorial message
        drawB(0, .14, w, .73, '#000000DD'); //tutorial backing
        drawB(.022, .38, .118, .24, '#99555580'); // discard
        drawB(.862, .38, .118, .24, '#7755CC88'); // Deck
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
        
        renderSuits(.62, .5, 1);
        renderSuits(.67, .5, 3);
        renderSuits(.72, .5, 2);
        renderSuits(.77, .5, 0);
        if(deckActive) {
            drawB(.862, .38, .118, .24, '#111111BB'); // deck hover
        }


    }
 }

function loadingScreen(timestamp) {
    let calcPer = Math.ceil((loadPer/maxPer)*100);
    
    // Initial flash effect on load
    cx.fillStyle = c4;
    cx.fillRect(0, 0, cvs.width, cvs.height);
    
    cx.globalAlpha = 0.7;
    cx.fillStyle = c0;
    cx.font = "normal bold 32px monospace";
    
    if(calcPer >= 100) {
        cx.fillText("LOADING... 100%" , 0.07*w, 0.9*h);
        if(!loaded) {
            loaded = true;
            setTimeout(() => {
                stateMain = MAIN_STATES.TITLE;
            }, 1000);
            console.log("LOADED == TRUE");
        }
    } else {
        cx.fillText("LOADING... " + calcPer +"%" , 0.07*w, 0.9*h);
    }
    
    cx.globalAlpha = 1;
}

function renderTitle(timestamp) {
    cx.globalAlpha = 1;
    // drawB(0, 0, w, h, '#558'); //background
    drawB(0, 0, w, h, '#4F4F7F'); //background
    // drawB(0, 0, w, h, c4); //background
    
    cx.globalAlpha = 0.15;
    uiS[1].render();

    //Achievements - Under
    for (let i=5; i<9; i++) {
        if(!ownedNFTs.includes(i-4)) {
            cx.globalAlpha = 0.4;
            uiS[i].render();

        }
    }

    cx.globalAlpha = 0.8;
    if(tCard) {
        tCard.render();
    }

    renderButtons();
    
    // AVAX Button
    drawB(0.415, 0.78, 0.055, 0.1, '#CCC'); //button outer
    drawB(0.418, 0.787, 0.047, 0.085, '#F55'); //red frame
    drawB(0.426, 0.808, 0.028, 0.038, '#FDD'); //white center
    // Wallet AVAX Sprite render
    uiS[0].render();

    // Draw title Cards
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            titleCds[i].render();
        }
    }
    // drawB(0, 0.07, w, 0.30, '#27274477'); //title
    cx.globalAlpha = .6;
    drawB(0, 0, w, .36, c5); // title banner
    drawB(0, .91, w, .1, c5); // base banner
    
    // Title Text 
    cx.globalAlpha = 0.8;
    // uiT[0].render();
    uiT[28].render();
    uiT[29].render();
    uiT[30].render();
    // Wallet info / highlight
    uiT[11].render();

    cx.globalAlpha = 0.25;
    // Debug
    if(mobile) {
        uiT[10].render();
    } else {
        uiT[9].render();
    }

    if(highlight >= 0.02) {
        highlight -= 0.02;
    }
    cx.globalAlpha = highlight;
    drawB(0, .91, w, .1, c0); // base banner
    // drawB(.04, .91, .91, .05, c0);

    //Achievements - Over
    for (let i=5; i<9; i++) {
        if(ownedNFTs.includes(i-4)) {
            cx.globalAlpha = 0.8;
            uiS[i].render();
            uiS[i+4].render();
            cx.globalAlpha = 0.2;
            uiS[i+8].render();
            
            cx.globalAlpha = 0.8;
            if(i==5) {      renderSuits(uiS[i].x+0.04,uiS[i].y+0.06, 1);}
            else if (i==6) {renderSuits(uiS[i].x+0.04,uiS[i].y+0.06, 3);}
            else if (i==7) {renderSuits(uiS[i].x+0.04,uiS[i].y+0.06, 2);}
            else if (i==8) {renderSuits(uiS[i].x+0.04,uiS[i].y+0.06, 0);}
        }
    }
    cx.globalAlpha = 1.0;
    if(walletMM) {
        uiT[74].render();
        uiT[75].render();
    }

    renderSuits(.05, .22, 1);
    renderSuits(.15, .22, 3);
    renderSuits(.81, .22, 2);
    renderSuits(.91, .22, 0);
    // cx.font = "normal bold 22px monospace";
    // cx.fillText("TITLE", 0.45*w, 0.25*h);
    
}

function renderOptions(timestamp) {
    cx.globalAlpha = 0.8;
    drawB(0, 0, w, h, c3); //bg
    
    cx.globalAlpha = 0.1;
    uiS[1].render();
    cx.globalAlpha = 0.8;

    uiT[2].render();
    uiT[20].render();
    uiT[21].render();
    uiT[22].render();
    uiT[23].render();

    renderButtons();
}
function renderCredits(timestamp) {
    cx.globalAlpha = 0.8;
    drawB(0, 0, w, h, '#424'); //bg

    cx.globalAlpha = 0.4;
    uiS[1].render();
    cx.globalAlpha = 0.8;

    uiT[3].render();
    uiT[4].render();
    uiT[5].render();
    uiT[12].render();
    uiT[13].render();
    uiT[14].render();
    uiT[15].render();
    
    uiT[24].render();

    renderButtons();
}

function renderDebug() {
    // Blue background
    cx.fillStyle = '#448';
    cx.fillRect(w*0.125, 0, w2, h2);
    cx.fillStyle = '#AAF';
    // Test markers
    cx.fillRect(w*0.125, 0.1*h2, w2*0.01, 10);
    cx.fillRect(w*0.125, 0.2*h2, w2*0.01, 10);
    cx.fillRect(w*0.125, 0.5*h2, w2*0.01, 10);
    cx.fillRect(w*0.125, 0.8*h2, w2*0.01, 10);
    cx.fillRect(w*0.125, 0.9*h2, w2*0.01, 10);
    
    // Text
    cx.font = "normal bold 26px monospace";
    cx.fillText("JS13K", 0.16*w, 0.13*h);
    
    cx.fillStyle = '#113';
    if(mobile) {
        cx.fillText("[MOBILE]", 0.25*w, 0.13*h);
    } else {
        cx.fillText("[BROWSER]", 0.25*w, 0.13*h);
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
    // console.log("rendering buttons: ");
}

function debugMouse() {
    drawB((mouseX/w)-0.01, (mouseY/h)-0.02, 0.02, 0.04, '#22AAFF50');
}