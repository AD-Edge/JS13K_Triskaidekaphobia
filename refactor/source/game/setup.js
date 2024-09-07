/////////////////////////////////////////////////////
// Game Setup Functions
/////////////////////////////////////////////////////

// Add required event listeners
function setupEventListeners(c) {
    // Event listener to track mouse movement
    c.addEventListener('pointermove', (e) => {
        // console.log("pointermove");
        getMousePos(e, c);
        logicCheckHOV();
    });
    c.addEventListener('pointerdown', (e) => {
        // console.log("pointerdown");
        getMousePos(e, c);
        logicCheckHOV();
        logicCheckCLK();
    });
    // Pointer cancel - the same as pointer up, but for mobile specific cases
    c.addEventListener('pointercancel', (e) => {
        // console.log("pointercancel");
        logicCheckUP();
        pointerReleased()
    });
    c.addEventListener('pointerup', (e) => {
        // console.log("pointerup");
        logicCheckUP();
        pointerReleased()
    });
}
// Detects values to try to determine if the device is mobile
function isMobile() {
    const isTouchDevice = navigator.maxTouchPoints > 0;
    const onTouchStart = 'ontouchstart' in window ;
    console.log("Is TouchDevice: " + isTouchDevice);
    console.log("onTouchStart: " + onTouchStart);
    // let checkWin = windowCheck();
    // console.log("Is SmallScreen: " + checkWin);

    return isTouchDevice || onTouchStart;
    // return checkWin || isTouchDevice || onTouchStart;
}
// function windowCheck() {
//     const isSmallScreen = window.innerWidth <= 767;
//     return isSmallScreen;
// }

// Adjust cvs size to maximum dimensions - for mobile only
function adjustCanvasForMobile() {
    console.log("Scaling cvs for Mobile");
    // const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    cvs.style.height = window.innerWidth + 'px';
    cvs.style.width = window.innerWidth*asp + 'px';
    canvas3d.style.height = window.innerWidth + 'px';
    canvas3d.style.width = window.innerWidth*asp + 'px';
    
}

// Primary Sprite Loading Process
function startLoad() {
    try {
        setTimeout(() => {
            cg.canvas.width = 32; cg.canvas.height = 32;
            genSPR(pA, 1, spriteActors)
            console.log('spriteActors sprites generated...');
            cg.canvas.width = 5; cg.canvas.height = 6;
            genSPR(p6B, 1, spriteIcons);
            console.log('spriteIcons Black sprites generating...');
            cg.canvas.width = 5; cg.canvas.height = 6;
            genSPR(p6R, 2, spriteIcons);
            
            setTimeout(() => {
                console.log('spriteIcons Red array of sprites generating...');
                cg.canvas.width = 3; cg.canvas.height = 4;
                genSPR(p4, 0, fntW);
                genSPR(p4, 1, fntB);
                genSPR(p4, 2, fntR);
                console.log('fntW, fntB, fntR array(s) of sprites generating...');
                cg.canvas.width = 9; cg.canvas.height = 12;
                genSPR(p9, 1, sprN);
                console.log('sprN array of sprites generating...');
                cg.canvas.width = 12; cg.canvas.height = 12;
                genSPR(p12, 2, sprS);
                console.log('sprS array of sprites generating...');
                
                
                setTimeout(() => {
                    cg.canvas.width = 9; cg.canvas.height = 12;
                    genMiniCards(9, 12);
                    console.log('Mini Card sprites generating...');
                    

                    setTimeout(() => {
                        cg.canvas.width = 18; cg.canvas.height = 18;
                        genSPR(p18, 1, sprS);
                        console.log('sprS array of sprites generating more...');
                        
                        setTimeout(() => {
                            
                            if(debug) { // Debugs sprite arrays now generated
                                debugArrays();
                            }
                            
                            // playerCardHand[0] = new card('A', deckPos, cardASlots[0], generateNumber(rng, 1, 4), generateNumber(rng, 1, 10), 0, 0);
                            tCard = new card('T', {x: 0.8, y: 0.45}, {x: 0.8, y: 0.45}, generateNumber(rng, 0, 3), 13, -0.5, false);

                            for (let i=0; i<=6;i++) {
                                let rPos = 
                                {x: generateNumber(rng, 0.1, 0.75), y: generateNumber(rng, -0.4, -0.9)};
                                let rSpd = generateNumber(rng, -0.8, -1.5);

                                titleCds[i] = new card('A', rPos, rPos, generateNumber(rng, 0, 3), null, rSpd, true);
                            };

                            if(debug) {recalcDebugArrays();}

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
        new uix(2, .04, .44, .15, .1, '#2AF', 'START', null), // 1
        new uix(2, .04, .6, .20, .08, '#2AF', 'OPTIONS', null), // 2
        new uix(2, .04, .7, .20, .08, '#2AF', 'CREDITS', null), // 3
        new uix(2, .05, .1, .17, .08, '#F42', 'BACK', null), // 4
        new uix(2, .81, .27, .16, .11, '#6F6', 'CONT', null), // 5
        new uix(2, .80, .735, .16, .11, '#6F6', 'NEXT', null), // 6
        new uix(2, .28, .65, .23, .06, '#2AF', 'REPLAY', null), // 7
        new uix(2, .56, .65, .15, .06, '#FA2', 'EXIT', null), // 8
        new uix(2, .04, .8, .42, .1, '#AAF', 'CONNECT WALLET', null), // 9
        new uix(2, .01, .94, .1, .1, '#888', '...', null), // 10
    ];
    uiT = [
        new uix(1, .22, .1, 3.5, 0, null, 'JS13K TITLE', null),
        new uix(1, .05, .5, 1.5, 0, null, 'DSC', null),
        new uix(1, .35, .2, 3, 0, null, 'OPTIONS', null),
        new uix(1, .35, .2, 3, 0, null, 'CREDITS', null),
        new uix(1, .28, .35, 1.5, 0, null, 'A GAME BY ALEX_ADEDGE', null),
        new uix(1, .35, .40, 1.5, 0, null, 'FOR JS13K 2024', null),
        new uix(1, .31, .44, 2, 0, null, 'END OF ROUND', null), // 6
        new uix(1, .32, .52, 2, 0, null, 'PLAYER WINS', null), // 7
        new uix(1, .34, .52, 2, 0, null, 'GAME OVER', null), // 8
        new uix(1, .75, .32, 1.5, 0, null, '|BROWSER|', null), // 9
        new uix(1, .75, .32, 1.5, 0, null, '|MOBILE|', null), // 10
        new uix(1, .06, .925, 1, 0, null, 'NOT CONNECTED', null), // 11
        new uix(1, .34, .54, 1.5, 0, null, 'SPECIAL THANKS:', null), //12
        new uix(1, .31, .62, 1.5, 0, null, 'FRANK FORCE - ZZFX', null), //13
        new uix(1, .28, .66, 1.5, 0, null, 'KEITH CLARK - ZZFXM', null), //14
        new uix(1, .25, .70, 1.5, 0, null, 'CSUBAGIO - SHADER SETUP', null), //15
        new uix(1, .15, .29, 1.5, 0, null, 'ROUND X OF X', null), //16
        new uix(1, .274, .29, 1.5, 0, null, 'X', null), //17
        new uix(1, .07, .08, 2, 0, null, 'GAME I', null), //18
        new uix(1, .42, .52, 2, 0, null, 'TIE', null), //19
    ];
    uiS = [
        // ix, x, y, dx, dy, c, str, img
        new uix(0, .423, .815, .07, .07, null, '', sprS[0], 0), // AVAX sprite
        new uix(0, -.1, -.1, 3.2, 1.6, null, '', bg, .0002), // BG sprite
        new uix(0, .417, .018, .116, .12, null, '', spriteActors[1], 0), // NPC0 sprite
        new uix(0, .417, .018, .116, .12, null, '', spriteActors[2], 0), // NPC1 sprite
        new uix(0, .417, .018, .116, .12, null, '', spriteActors[3], 0), // NPC2 sprite
        new uix(0, .28, .4, .15, .15, null, '', sprS[1], 0), // Badge 0
        new uix(0, .38, .4, .15, .15, null, '', sprS[1], 0), // Badge 1
        new uix(0, .48, .4, .15, .15, null, '', sprS[1], 0), // Badge 2
        new uix(0, .58, .4, .15, .15, null, '', sprS[1], 0), // Badge 3
        new uix(0, .68, .4, .15, .15, null, '', sprS[1], 0), // Badge 4
        new uix(0, .28, .56, .15, .15, null, '', sprS[1], 0), // Badge 5
        new uix(0, .38, .56, .15, .15, null, '', sprS[1], 0), // Badge 6
        new uix(0, .48, .56, .15, .15, null, '', sprS[1], 0), // Badge 7
        new uix(0, .58, .56, .15, .15, null, '', sprS[1], 0), // Badge 8
        new uix(0, .68, .56, .15, .15, null, '', sprS[1], 0), // Badge 9
        new uix(0, .48, .72, .15, .15, null, '', sprS[1], 0), // Badge 10
        new uix(0, .58, .72, .15, .15, null, '', sprS[1], 0), // Badge 11
        new uix(0, .68, .72, .15, .15, null, '', sprS[1], 0), // Badge 12
        
    ];
    newDeckStack();
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

function newDeckStack() {
    deckStack = [
        new card(null, {x: deckPos.x, y: deckPos.y}, {x: deckPos.x, y: deckPos.y}, 4),
        new card(null, {x: deckPos.x+0.005, y: deckPos.y-0.005}, {x: deckPos.x+0.005, y: deckPos.y-0.005}, 4),
        new card(null, {x: deckPos.x+0.010, y: deckPos.y-0.010}, {x: deckPos.x+0.010, y: deckPos.y-0.010}, 4),
        new card(null, {x: deckPos.x+0.015, y: deckPos.y-0.015}, {x: deckPos.x+0.015, y: deckPos.y-0.015}, 4)
    ];
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

function generateCardsFromDeck(num) {
    // Main game cards (1st round)
    for(let i = 0; i < num; i++) {
        cardGenQueueA[i] = new card('A', deckPos, deckPos, generateNumber(rng, 0, 3), generateNumber(rng, 0, 12));
    }
    if(debug) { recalcDebugArrays(); }
}
