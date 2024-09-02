/////////////////////////////////////////////////////
// Render Functions
/////////////////////////////////////////////////////

function renderGame(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);
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
    drawBox(0, 0, w, h, '#222222EE'); //background
    
    cx.globalAlpha = 0.1;
    uiS[1].render();
    cx.globalAlpha = 0.8;
    
    // drawBox(0, 0, w, h, '#22445510'); //background
    drawBox(0, 0.032, w, 0.35, '#00000055'); //title
    
    
    
    cx.globalAlpha = 0.8;
    // Title Text 
    uiT[0].render();
    cx.globalAlpha = 1.0;
    
    renderButtons();
    
    drawBox(0.415, 0.85, 0.05, 0.1, '#CCC'); //button outer
    drawBox(0.418, 0.855, 0.046, 0.085, '#F55'); //red frame
    drawBox(0.426, 0.876, 0.028, 0.038, '#FDD'); //white center
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
    
    if(debug) { debugMouse(); }
}

function renderOptions(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    // Draw Test #1
    cx.globalAlpha = 0.8;
    drawBox(0, 0, w, h, '#222222EE'); //bg
    
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
    drawBox(0, 0, w, h, '#222222EE'); //bg

    // uiT[3].render(cx, w, h);
    // uiT[4].render(cx, w, h);
    // uiT[5].render(cx, w, h);

    // renderButtons();
}

// Draw all buttons
function renderButtons() {
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].render();
        uiB[i].checkHover(mouseX, mouseY);
    }
    // console.log("rendering buttons: ");
}