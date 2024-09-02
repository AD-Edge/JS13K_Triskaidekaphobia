/////////////////////////////////////////////////////
// Game Setup Functions
/////////////////////////////////////////////////////

// Add required event listeners
function setupEventListeners(c) {
    // Event listener to track mouse movement
    c.addEventListener('pointermove', (e) => {
        getMousePos(e, c);
    });
    c.addEventListener('pointerdown', (e) => {
        getMousePos(e, c);
        for (let i = titleCds.length; i >= 0; i--) {
            if(titleCds[i] != null && currentHover != null) {
                var click = titleCds[i].checkClick(true);
                if(click) {
                    currentHeld = [titleCds[i], 0];
                    return;
                }
            }
        }
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
    c.addEventListener('pointercancel', (e) => {
        pointerReleased()
    });
    c.addEventListener('pointerup', (e) => {
        pointerReleased()
    });
}

function getMousePos(e, c) {
    rect = c.getBoundingClientRect();
    // Get Mouse location
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    // Inversion for mobile setting
    if(mobile) {
        let tempX = mouseX;
        mouseX = mouseY*asp2;
        mouseY = h2 - (tempX*asp2);
    }    
    let check = false;
    // Check if the card is hovered
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            if (playerCardHand[i].checkHover(mouseX, mouseY, w, h)) {    
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
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            if (titleCds[i].checkHover(mouseX, mouseY, w, h)) {    
                check = true;
                currentHover = titleCds[i];
                if(currentHeld == null) {
                    titleCds[i].isHov = true;
                }
            } else {
                titleCds[i].isHov = false;
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
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            titleCds[i].checkClick(false);
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
    canvas3d.style.height = window.innerWidth + 'px';
    canvas3d.style.width = window.innerWidth*asp + 'px';
    
    // canvas3d.width = w2;
    // canvas3d.height = h2;

}

// Primary Sprite Loading Process
function startLoad() {
    try {
        setTimeout(() => {
            cg.canvas.width = 32; cg.canvas.height = 32;
            genSPR(pA, 1, spriteActors)
            console.log('Black sprites generated...');
            cg.canvas.width = 5; cg.canvas.height = 6;
            genSPR(p6B, 1, spriteIcons);
            console.log('Red sprites generating...');
            cg.canvas.width = 5; cg.canvas.height = 6;
            genSPR(p6R, 2, spriteIcons);
            
            setTimeout(() => {
                console.log('Second array of sprites generating...');
                cg.canvas.width = 3; cg.canvas.height = 4;
                genSPR(p4, 0, fntA);
                console.log('Second array of sprites generating...');
                cg.canvas.width = 9; cg.canvas.height = 12;
                genSPR(p9, 1, sprN);
                console.log('Third array of sprites generating...');
                cg.canvas.width = 12; cg.canvas.height = 12;
                genSPR(p12, 2, sprS);
                console.log('Fourth array of sprites generating...');
                
                setTimeout(() => {
                    cg.canvas.width = 9; cg.canvas.height = 12;
                    genMiniCards(9, 12);
                    console.log('Mini Card sprites generating...');

                    setTimeout(() => {
                        
                        if(debug) { // Debugs sprite arrays now generated
                            debugArrays();
                        }
                        
                        setTimeout(() => {
                            playerCardHand[0] = new card('A', deckPos, deckPos, generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));
                            
                            titleCds[0] = new card('A', deckPos, deckPos, generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));
                        }, 400);
            
                        setupUI();

                        // Draw canvas backing
                        cx.clearRect(0, 0, cvs.width, cvs.height);
                        cx.fillStyle = '#111';
                        cx.fillRect(0, 0, cvs.width, cvs.height);
                    
                        zzfx(...[.5,,582,.02,.02,.05,,.5,,,,,,,36,,,.81,.02]); // Load
                    }, 500);
                }, 200);
            }, 200);
        }, 200);
        
    } catch(error) {
        console.error('Error loading sprites:' + error);
    }
}
// Creates all UI objects as needed
function setupUI() {
    uiB = [
        null, // Use up slot 0 for better logic
        new uix(2, 0.06, 0.50, 0.15, 0.1, '#2AF', 'START', null), // 1
        new uix(2, 0.06, 0.62, 0.20, 0.08, '#2AF', 'OPTIONS', null), // 2
        new uix(2, 0.06, 0.72, 0.20, 0.08, '#2AF', 'CREDITS', null), // 3
        new uix(2, 0.05, 0.88, 0.17, 0.08, '#F42', 'BACK', null), // 4
        new uix(2, 0.81, 0.27, 0.16, 0.11, '#6F6', 'CONT', null), // 5
        new uix(2, 0.80, 0.735, 0.16, 0.11, '#6F6', 'NEXT', null), // 6
        new uix(2, 0.28, 0.65, 0.23, 0.06, '#2AF', 'REPLAY', null), // 7
        new uix(2, 0.56, 0.65, 0.15, 0.06, '#FA2', 'EXIT', null), // 8
        new uix(2, 0.06, 0.85, 0.41, 0.1, '#FAA', 'CONNECT WALLET', null), // 9
    ];
    uiT = [
        new uix(1, 0.22, 0.1, 3.5, 0, null, 'JS13K TITLE', null),
        new uix(1, 0.05, 0.5, 1.5, 0, null, 'DSC', null),
        new uix(1, 0.35, 0.2, 2, 0, null, 'OPTIONS', null),
        new uix(1, 0.35, 0.2, 2, 0, null, 'CREDITS', null),
        new uix(1, 0.23, 0.60, 1, 0, null, 'A GAME BY ALEX DELDERFILED', null),
        new uix(1, 0.33, 0.65, 1, 0, null, 'FOR JS13K 2O24', null),
        new uix(1, 0.25, 0.45, 2, 0, null, 'END OF ROUND', null), // 6
        new uix(1, 0.27, 0.55, 2, 0, null, 'PLAYER WINS', null), // 7
        new uix(1, 0.31, 0.55, 2, 0, null, 'GAME OVER', null), // 8
    ];
    uiS = [
        // ix, x, y, dx, dy, c, str, img
        new uix(0, 0.423, 0.863, 0.07, 0.07, null, '', sprS[0]), // AVAX sprite
        new uix(0, -0.1, -0.1, 3.2, 1.6, null, '', bg, 1), // BG sprite
        
    ];
    deckStack = [
        new card(null, {x: deckPos.x, y: deckPos.y}, {x: deckPos.x, y: deckPos.y}, 0),
        new card(null, {x: deckPos.x+0.005, y: deckPos.y-0.005}, {x: deckPos.x+0.005, y: deckPos.y-0.005}, 0),
        new card(null, {x: deckPos.x+0.010, y: deckPos.y-0.010}, {x: deckPos.x+0.010, y: deckPos.y-0.010}, 0),
        new card(null, {x: deckPos.x+0.015, y: deckPos.y-0.015}, {x: deckPos.x+0.015, y: deckPos.y-0.015}, 0)
    ];
    console.log("UI Setup Complete");
}

function genSPR(arr, col, out) {
    try {
        // Process each element in the array to generate a sprite
        arr.forEach((element, index) => {
                genSpriteImg(element, col, out);
                // loadPer++;
                // console.log(`Generated sprite for element ${index}:`, element + " now LoadPercent: " + loadPer);
        });
    } catch (error) {
        console.error('Error generating sprites:' + error);
    }
}

// Activates all buttons in actAr
// TODO do this without nesting for loops
function setButtons(actAr) {
    //disable all buttons
    for (let i = 1; i < uiB.length; i++) { 
        uiB[i].togActive(false);
    }
    // Reactivate specified
    for (let i = 1; i < uiB.length; i++) { // Check if button should be active
        for (let j = 0; j < actAr.length; j++) { // Check if button should be active
            if (actAr[j] === i) {
                uiB[i].togActive(true);
                // console.log("button activate: " + i);
            }
        }
    }
}

function setupMusic() {

}

function setupGL() {
    
    
}