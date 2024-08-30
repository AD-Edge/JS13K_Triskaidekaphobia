/////////////////////////////////////////////////////
// Main Game Class
/////////////////////////////////////////////////////

// App Setup
window.onload = function() {
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
    
    loadSprites();
    // Generate mini cards
    setTimeout(() => {
        genMiniCards(9, 12);
    }, 300);
    setupEventListeners();

    setTimeout(() => {
        playerCardHand[0] = new card('A', deckPos, deckPos, generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));
        
        if(debug) { // Debugs sprite arrays now generated
            debugArrays();
        }
        
        cx.clearRect(0, 0, cvs.width, cvs.height);
        cx.fillStyle = '#111';
        cx.fillRect(0, 0, cvs.width, cvs.height);
        
        // Draw initial content (if any)
        renderScene();
    }, 500);

}

// Add required event listeners
function setupEventListeners() {
    // Event listener to track mouse movement
    cvs.addEventListener('pointermove', (e) => {
        
        getMousePos(e);

    });
    cvs.addEventListener('pointerdown', (e) => {
        getMousePos(e);
        for (let i = playerCardHand.length; i >= 0; i--) {
            if(playerCardHand[i] != null && currentHover != null) {
                var click = playerCardHand[i].checkClick(true);
                if(click) {
                    currentHeld = [playerCardHand[i], 0];
                    return;
                }
            }
        }
    });
    cvs.addEventListener('pointercancel', (e) => {
        pointerReleased()
    });
    cvs.addEventListener('pointerup', (e) => {
        pointerReleased()
    });
}

function getMousePos(e) {
    rect = cvs.getBoundingClientRect();
    // Get Mouse location
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    // Adjust for mobile setting
    if(mobile) {
        let tempX = mouseX;
        mouseX = mouseY*asp2;
        mouseY = h2 - (tempX*asp2);
    }

    
    let check = false;
    // Check if the card is hovered
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            if (playerCardHand[i].checkHover(mouseX, mouseY, width, height)) {    
                check = true;
                currentHover = playerCardHand[i];
                if(currentHeld == null) {
                    playerCardHand[i].isHovered = true;
                }
            } else {
                playerCardHand[i].isHovered = false;
            }
        }
    }
    if(check == false) {
        currentHover = null;
    }

}
function pointerReleased() {
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].checkClick(false);
        }
    }
    // Drop current held
    if(currentHeld != null) {
        currentHeld = null;
    }
}

// Primary Render Control
function renderScene(timestamp) {
    cx.clearRect(0, 0, width, height);
    
    renderDebug(cx);
    // Timeout for flash
    setTimeout(() => {
        cvs.style.outlineColor  = '#66c2fb';
    }, 100);

    debugMouse();
    // Request next frame, ie render loop
    requestAnimationFrame(renderScene);
}

function renderDebug() {
    // Blue background
    cx.fillStyle = '#448';
    cx.fillRect(width*0.125, 0, w2, h2);
    cx.fillStyle = '#AAF';
    // Test markers
    cx.fillRect(width*0.125, 0.1*h2, w2*0.01, 10);
    cx.fillRect(width*0.125, 0.2*h2, w2*0.01, 10);
    cx.fillRect(width*0.125, 0.5*h2, w2*0.01, 10);
    cx.fillRect(width*0.125, 0.8*h2, w2*0.01, 10);
    cx.fillRect(width*0.125, 0.9*h2, w2*0.01, 10);
    
    // Text
    cx.font = "normal bold 26px monospace";
    cx.fillText("JS13K", 0.16*width, 0.13*height);
    
    cx.fillStyle = '#113';
    if(mobile) {
        cx.fillText("[MOBILE]", 0.25*width, 0.13*height);
    } else {
        cx.fillText("[BROWSER]", 0.25*width, 0.13*height);
    }
    
    // Draw Player A Cards
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].render(cx, width, height);
        }
    }
    
}

// Detects values to try to determine if the device is mobile
function isMobile() {
    const isTouchDevice = navigator.maxTouchPoints > 0;
    const onTouchStart = 'ontouchstart' in window ;
    console.log("Is TouchDevice: " + isTouchDevice);
    console.log("onTouchStart: " + onTouchStart);
    let checkWin = windowCheck();
    console.log("Is SmallScreen: " + checkWin);

    return checkWin || isTouchDevice || onTouchStart;
}
function windowCheck() {
    const isSmallScreen = window.innerWidth <= 767;
    return isSmallScreen;
}

// Adjust cvs size to maximum dimensions - for mobile only
function adjustCanvasForMobile() {
    console.log("Scaling cvs for Mobile");
    // const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    cvs.style.height = window.innerWidth + 'px';
    cvs.style.width = window.innerWidth*asp + 'px';

    //reset
    rect = cvs.getBoundingClientRect();

    console.log("cvs Inner Resolution: " + cvs.width + "x" + cvs.height);
    console.log("cvs Width/Height: " + cvs.style.width + " x " + cvs.style.height);
}

function debugMouse() {
    drawBox(cx, mouseX-10, mouseY-10, 20, 20, '#0000FF50');
}