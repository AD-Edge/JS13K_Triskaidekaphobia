/////////////////////////////////////////////////////
// Index Main
/////////////////////////////////////////////////////

// App Setup
window.onload = function() {
    initSetup();
    setupMusic();
}

function initSetup() {
    app = document.getElementById('app');
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

    maxPer = pA.length + p6B.length + p6R.length + p9.length + p4.length + p12.length;
    
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
        app.appendChild(canvas3d);
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
    
    renderTick();
}

// Primary Render Control
function renderTick(timestamp) {
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


    if(webGL){
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cvs);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // Request next frame, ie render loop
    requestAnimationFrame(renderTick);
}