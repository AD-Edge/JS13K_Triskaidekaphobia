/////////////////////////////////////////////////////
// Index Main
/////////////////////////////////////////////////////

// App Setup
window.onload = function() {
    // loadWeb3();
    initSetup();
    setupMusic();
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

    maxPer = pA.length + p6B.length + p6R.length + p9.length + (p4.length*3) + p12.length + p18.length;
    
    console.log("Game Started");
    console.log("Screen Width/Height: " + window.innerWidth + "x" + window.innerHeight);
    // console.log("cvs Inner Resolution: " + cvs.width + "x" + cvs.height);
    // console.log("Aspect Ratio: " + asp);
    // console.log("Aspect Ratio2: " + asp2);
    // Mobile check
    mobile = isMobile();
    if (mobile) {
        adjustCanvasForMobile();
        console.log("[Mobile Mode]");
    } else {
        canvas3d.style.height = h2 + 'px';
        canvas3d.style.width = w2 + 'px';
        console.log("[Browser Mode]");
    }
    if(webGL) {
        // rect = canvas3d.getBoundingClientRect();
        console.log("canvas3d Inner Resolution: " + canvas3d.width + "x" + canvas3d.height);
        console.log("canvas3d Width/Height: " + canvas3d.style.width + " x " + canvas3d.style.height);
    } else {
        // rect = cvs.getBoundingClientRect();
        console.log("cvs Inner Resolution: " + cvs.width + "x" + cvs.height);
        console.log("cvs Width/Height: " + cvs.style.width + " x " + cvs.style.height);
    }

    if(webGL) {
        cvs.style.display = 'none';
        document.body.appendChild(canvas3d);
        // canvas3d.style.width = w + 'px';
        // canvas3d.style.height = h + 'px';
        setupEventListeners(canvas3d);
        // canvas3d.width = w * 8;
        // canvas3d.height = h * 8;
        // setupShader();
    } else {
        setupEventListeners(cvs);
    }
    // Kick off Loading
    startLoad();
    // Kick off main tick
    tick();
}

// Primary r Control
function tick(timestamp) {
    cx.clearRect(0, 0, w, h);
    // State Functionality Basics
    if(stateMain != statePrev) {
        manageStateMain(); }
    if(stateRound != stateRPrev) {
        manageStateRound(); }
    if(stateMain == MAIN_STATES.LD) {
        loadingScreen(timestamp);
    } else if (stateMain == MAIN_STATES.T) {
        renderTitle(timestamp);
        // musicTick(timestamp);
    } else if (stateMain == MAIN_STATES.C) {
        renderCredits(timestamp);
    } else if (stateMain == MAIN_STATES.O) {
        renderOptions(timestamp);
    } else if (stateMain == MAIN_STATES.GR) {
        // renderDebug(timestamp);
        renderGame(timestamp);
        tickGame(timestamp);
    } else if (stateMain == MAIN_STATES.ER) {
        // rEndRound(); 
    }
    // Mouse Required
    debugMouse();

    if(webGL){
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cvs);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    if(clkDel > 0) { //slight delay for click checks
        clkDel -= .05;
    }
    // Request next frame, ie r loop
    requestAnimationFrame(tick);
}
