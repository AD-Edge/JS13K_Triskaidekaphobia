/////////////////////////////////////////////////////
// Index Main
/////////////////////////////////////////////////////

// App Setup
window.onload = function() {

    initSetup();
    // loadSprites();
    setupEventListeners();

}

function initSetup() {
    cvs = document.getElementById('cvs');
    cx = cvs.getContext("2d");
    w = cvs.clientWidth;
    h = cvs.clientHeight;
    asp = w/h; // Aspect ratio of window
    asp2 = w2/h2; // Aspect ratio of inner cvs
    // pad = document.getElementById("drawPad");
    // ctp = pad.getContext("2d");
    // ctp.imageSmoothingEnabled = false;
    cx.imageSmoothingEnabled = false;
    
    // Initial flash effect on load
    cx.fillStyle = '#88F';
    cx.fillRect(0, 0, cvs.width, cvs.height);
    cvs.style.outlineColor  = '#000000';
    cx.fillStyle = '#000';
    cx.font = "normal bold 24px monospace";
    // cx.fillText("LOADING... " + "?%", 0.05*w, 0.9*h);
    cx.fillText("LOADING... ", 0.05*w, 0.9*h);

    console.log("Game Started");
    console.log("Screen Width/Height: " + window.innerWidth + "x" + window.innerHeight);
    console.log("cvs Inner Resolution: " + cvs.width + "x" + cvs.height);
    console.log("Aspect Ratio: " + asp);
    console.log("Aspect Ratio2: " + asp2);
    // Mobile check
    mobile = isMobile();
    if (mobile) {
        adjustCanvasForMobile();
        console.log("[Mobile Mode]");
    } else {
        console.log("[Browser Mode]");
    }
    
    // Kick off Loading
    startLoad();
}

// Primary Sprite Loading Process
function startLoad() {
    cg.canvas.width = 32; cg.canvas.height = 32;
    genSPR(pA, 1, spriteActors).then(() => {
        console.log('Black sprites generated.');
        cg.canvas.width = 5; cg.canvas.height = 6;
        return genSPR(p6B, 1, spriteIcons);
    }).then(() => {
        console.log('Red sprites generated.');
        cg.canvas.width = 5; cg.canvas.height = 6;
        return genSPR(p6R, 2, spriteIcons);
    }).then(() => {
        console.log('Second array of sprites generated.');
        cg.canvas.width = 3; cg.canvas.height = 4;
        return genSPR(p4, 1, fntA);
    }).then(() => {
        console.log('Second array of sprites generated.');
        cg.canvas.width = 9; cg.canvas.height = 12;
        return genSPR(p9, 1, sprN);
    }).then(() => {
        console.log('Third array of sprites generated.');
        cg.canvas.width = 9; cg.canvas.height = 12;
        return genMiniCards(9, 12);
    }).then(() => {
        console.log('Mini Card sprites generated.');

        playerCardHand[0] = new card('A', deckPos, deckPos, generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));
        if(debug) { // Debugs sprite arrays now generated
            debugArrays();
        }
        // Draw canvas backing
        cx.clearRect(0, 0, cvs.width, cvs.height);
        cx.fillStyle = '#111';
        cx.fillRect(0, 0, cvs.width, cvs.height);
        
        setTimeout(() => {
            renderScene();
        }, 200);
    }).catch(error => {
        console.error('Error loading sprites:', error);
    });
}

function genSPR(arr, col, out) {
    return new Promise((resolve, reject) => {
        try {
            // Process each element in the array to generate a sprite
            arr.forEach((element, index) => {
                genSpriteImg(element, col, out);
                loadPer++;
                console.log(`Generated sprite for element ${index}:`, element + " now LoadPercent: " + loadPer);
            });
            // Once all sprites are generated, resolve the promise
            resolve();
        } catch (error) {
            reject(`Error generating sprites: ${error}`);
        }
    });
}

// Primary Render Control
function renderScene(timestamp) {
    cx.clearRect(0, 0, w, h);
    // Debug for working out new template rendering setup 
    

    // Timeout for flash
    setTimeout(() => {
        cvs.style.outlineColor  = '#66c2fb';
    }, 100);

    // State Functionality Basics
    if(stateMain != statePrev) {
        manageStateMain(); }
    if(stateRound != stateRPrev) {
        manageStateRound(); }
    if(stateMain == MAIN_STATES.TITLE) {
        renderTitle();
    } else if (stateMain == MAIN_STATES.CREDITS) {
        // renderCredits();
    } else if (stateMain == MAIN_STATES.OPTIONS) {
        // renderOptions(timestamp);
    } else if (stateMain == MAIN_STATES.GAMEROUND) {
        renderDebug(cx);
        // renderGame(timestamp);
    } else if (stateMain == MAIN_STATES.ENDROUND) {
        // renderEndRound(); 
    }

    if(debug) { debugMouse(); }
    // Request next frame, ie render loop
    requestAnimationFrame(renderScene);
}