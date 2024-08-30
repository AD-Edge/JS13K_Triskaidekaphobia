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

    maxPer = pA.length + p6B.length + p6R.length + p9.length + p4.length;
    
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
    
    renderScene();

    // Kick off Loading
    startLoad();
}

// Primary Render Control
function renderScene(timestamp) {
    cx.clearRect(0, 0, w, h);
    // Timeout for flash
    // setTimeout(() => {
    //     cvs.style.outlineColor  = '#66c2fb';
    // }, 100);
    // State Functionality Basics
    if(stateMain != statePrev) {
        manageStateMain(); }
    if(stateRound != stateRPrev) {
        manageStateRound(); }
    if(stateMain == MAIN_STATES.LOAD) {
        loadingScreen(timestamp);
    } else if (stateMain == MAIN_STATES.TITLE) {
        renderTitle(timestamp);
    } else if (stateMain == MAIN_STATES.CREDITS) {
        // renderCredits(timestamp);
    } else if (stateMain == MAIN_STATES.OPTIONS) {
        // renderOptions(timestamp);
    } else if (stateMain == MAIN_STATES.GAMEROUND) {
        renderDebug(timestamp);
        // renderGame(timestamp);
    } else if (stateMain == MAIN_STATES.ENDROUND) {
        // renderEndRound(); 
    }

    if(debug) { debugMouse(); }
    // Request next frame, ie render loop
    requestAnimationFrame(renderScene);
}