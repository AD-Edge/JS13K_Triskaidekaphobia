/////////////////////////////////////////////////////
// Game Setup Functions
/////////////////////////////////////////////////////

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
                    playerCardHand[i].isHov = true;
                }
            } else {
                playerCardHand[i].isHov = false;
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
