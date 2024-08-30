/////////////////////////////////////////////////////
// Index Main
/////////////////////////////////////////////////////

// App Setup
window.onload = function() {

    initSetup();
    loadSprites();
    setupEventListeners();

    setTimeout(() => {
        genMiniCards(9, 12);
    }, 300);

    setTimeout(() => {
        playerCardHand[0] = new card('A', deckPos, deckPos, generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));
        if(debug) { // Debugs sprite arrays now generated
            debugArrays();
        }
        // Draw canvas backing
        cx.clearRect(0, 0, cvs.width, cvs.height);
        cx.fillStyle = '#111';
        cx.fillRect(0, 0, cvs.width, cvs.height);
        // Draw initial content (if any)
        renderScene();
    }, 500);

}

function initSetup() {
    cvs = document.getElementById('cvs');
    cx = cvs.getContext("2d");
    width = cvs.clientWidth;
    height = cvs.clientHeight;
    asp = width/height; // Aspect ratio of window
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
    // cx.fillText("LOADING... " + "?%", 0.05*width, 0.9*height);
    cx.fillText("LOADING... ", 0.05*width, 0.9*height);

    console.log("Game Started");
    console.log("Screen Width/Height: " + window.innerWidth + "x" + window.innerHeight);
    console.log("cvs Inner Resolution: " + cvs.width + "x" + cvs.height);
    console.log("Aspect Ratio: " + asp);
    console.log("Aspect Ratio2: " + asp2);
    
    mobile = isMobile();
    if (mobile) {
        adjustCanvasForMobile();
        console.log("[Mobile Mode]");
    } else {
        console.log("[Browser Mode]");
    }
    
}

// Primary Render Control
function renderScene(timestamp) {
    cx.clearRect(0, 0, width, height);
    // Debug for working out new template rendering setup 
    // renderDebug(cx);

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
        // renderGame(timestamp);
    } else if (stateMain == MAIN_STATES.ENDROUND) {
        // renderEndRound(); 
    }

    if(debug) { debugMouse(); }
    // Request next frame, ie render loop
    requestAnimationFrame(renderScene);
}