/////////////////////////////////////////////////////
// Render Functions
/////////////////////////////////////////////////////

function renderGame(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);
    // Blue background
    // cx.fillStyle = '#334';
    cx.fillStyle = '#222';
    cx.fillRect(0, 0, w2, h2);


    renderBacking();

    // Draw Player A Cards
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].render(cx, w, h);
        }
    }   
}

function renderBacking() {
    cx.globalAlpha = 1;
    // Middle grey box
    drawB(0, .20, w, .6, '#44444440');
    drawB(0, .22, w, .56, '#44444440');
    // Middle dark boxes
    drawB(.1, .24, .8, .52, '#111');
    drawB(.015, .26, .970, .48, '#111');// Edge L grey
    // Center Purple
    drawB(.115, .27, .77, .46, '#33224488');
    drawB(.115, .49, .77, .01, '#55555522'); //divider
    drawO(.115, .27, .77, .46, 1);

    // Score Array
    drawB(.8, .3, .05, .40, '#332540FF');
    drawB(.81, .34, .03, .04, '#222');
    drawB(.81, .41, .03, .04, '#222');
    drawB(.81, .475, .03, .04, '#222');
    drawB(.815, .482, .021, .025, '#733'); //marker
    drawB(.81, .54, .03, .04, '#222');
    drawB(.81, .605, .03, .04, '#222');
    
    // Hover table
    if(tableActive) {
        gpc.drawBox(ctx, 50, 250, 540, 100, '#66666677');
    }

    // DSC
    drawB(.03, .3, .1, .40, '#441530FF');
    drawB(.022, .38, .118, .24, '#CC657040');
    drawO(.03, .3, .1, .40, 1);
    cx.globalAlpha = 0.3;
    renderFont(.07, .41, w, h, 2.25, [3])
    renderFont(.07, .475, w, h, 2.25, [18])
    renderFont(.07, .54, w, h, 2.25, [2])
    cx.globalAlpha = 1;
    
    // DCK Pad
    drawB(.87, .3, .1, .40, '#232040FF');
    drawB(.862, .38, .118, .24, '#6345A050');
    drawO(.87, .3, .1, .40, 1);

    // DCK Draw
    
    // Player Hand
    if(handActive) {
        drawB(.2, .85, .6, .2, '#66666677');
    } else {
        drawB(.2, .85, .6, .2, '#111111CC');
    }
    drawO(.22, .88, .56, .2, 1);
    
    // Opponent Hand
    drawB(.5, 0, .4, .15, '#111111CC');
    drawO(.515, -0.018, .37, .15, 1);
    
    // Opponent Box
    drawB(.41, 0, .08, .15, '#111111CC');
    drawB(.417, 0.016, .065, .12, '#555');

}

function loadingScreen(timestamp) {
    let calcPer = Math.ceil((loadPer/maxPer)*100);
    
    // Initial flash effect on load
    cx.fillStyle = '#66c2fb';
    cx.fillRect(0, 0, cvs.width, cvs.height);
    cvs.style.outlineColor  = '#000000';
    
    cx.fillStyle = '#000';
    cx.font = "normal bold 24px monospace";
    
    if(calcPer >= 100) {
        cx.fillText("LOADING... 100%" , 0.05*w, 0.9*h);
        if(!loaded) {
            loaded = true;
            setTimeout(() => {
                stateMain = MAIN_STATES.TITLE;
            }, 1000);
            console.log("LOADED == TRUE");
        }
    } else {
        cx.fillText("LOADING... " + calcPer +"%" , 0.05*w, 0.9*h);
    }
}

function renderTitle(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    cx.globalAlpha = 0.5;
    drawB(0, 0, w, h, '#333333EE'); //background
    
    cx.globalAlpha = 0.1;
    uiS[1].render();
    cx.globalAlpha = 0.8;
    
    // drawB(0, 0, w, h, '#22445510'); //background
    drawB(0, 0.032, w, 0.35, '#00000055'); //title
    
    
    
    cx.globalAlpha = 0.8;
    // Title Text 
    uiT[0].render();
    cx.globalAlpha = 1.0;
    
    renderButtons();
    
    drawB(0.415, 0.85, 0.05, 0.1, '#CCC'); //button outer
    drawB(0.418, 0.855, 0.046, 0.085, '#F55'); //red frame
    drawB(0.426, 0.876, 0.028, 0.038, '#FDD'); //white center
    //Wallet AVAX Sprite render
    uiS[0].render();
    
    // Debug
    cx.fillStyle = '#FFF';
    cx.font = "normal bold 30px monospace";
    if(mobile) {
        cx.fillText("[MOBILE]", 0.80*w, 0.9*h);
    } else {
        cx.fillText("[BROWSER]", 0.80*w, 0.9*h);
    }
    
    // Draw Player A Cards
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            titleCds[i].render();
        }
    }

    renderSuits();
    // cx.font = "normal bold 22px monospace";
    // cx.fillText("TITLE", 0.45*w, 0.25*h);
    
}

function renderOptions(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    // Draw Test #1
    cx.globalAlpha = 0.8;
    drawB(0, 0, w, h, '#222222EE'); //bg
    
    // uiT[2].render(cx, w, h);

    // renderButtons();
}
function renderCredits(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    // Draw Test #1
    cx.globalAlpha = 0.8;
    drawB(0, 0, w, h, '#222222EE'); //bg

    // uiT[3].render(cx, w, h);
    // uiT[4].render(cx, w, h);
    // uiT[5].render(cx, w, h);

    // renderButtons();
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
            playerCardHand[i].render(cx, w, h);
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