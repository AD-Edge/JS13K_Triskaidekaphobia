/////////////////////////////////////////////////////
// Main Game Class
/////////////////////////////////////////////////////
// import './style.css';

import { createNumberGenerator, createSeedFromString, generateNumber } from './src/rng.js';
import * as gpc from './src/graphics.js';
import * as pro from './src/processor.js';
import uix from './src/uix.js';
import card from './src/card.js';
import { debugArray } from './src/debug.js';
import { zzfx } from './src/zzfx.js';
import { p4, p6, pA } from './src/px.js';
import { o1, o2, o3, o4 } from './src/tx.js';

var canvas = null;
var ctx = null;
var load = null;
var width = 0;
var height = 0;
// Draw test
var pad = null;
var ctp = null;

var debug = true;
var rng = null;
var seed = null;
var complex = true;
var rand = null;

var cardNum = 0;
var deckTotal = 52;
var discarded = 0;
var quater = Math.floor(deckTotal/4);
console.log("Discards after " + quater + " cards...");
var quaterTrack = 0;

var mouseX = -999;
var mouseY = -999;

const delayDuration = 400;

// Setup RNG
if(complex) { // Non deterministic seed
    seed = Date.now().toString(); 
} else { // Deterministic
    seed = "ItsGamejamTime"; 
}
// PRNG via ooflorent/example.js
rng = createNumberGenerator(
    createSeedFromString(seed)
);
rand = generateNumber(rng, -10, 10);

// Handle Cards
var currentHover = null;
var currentHeld = null;

const deckPos = {x: 0.875, y: 0.450};

// Card position slots
var cardASlots = [
    {x: 0.175, y: 0.84},
    {x: 0.325, y: 0.84},
    {x: 0.475, y: 0.84},
    {x: 0.625, y: 0.84},
    {x: 0.775, y: 0.84},
];
var cardBSlots = [
    {x: 0.450, y: 0.02},
    {x: 0.540, y: 0.02},
    {x: 0.630, y: 0.02},
    {x: 0.720, y: 0.02},
    {x: 0.810, y: 0.02},
];

var lastCardCreationTime = 0;
var chooseA = true;

// Card arrays for holding
var deckStack = [];
var cardGenQueueA = [];
var dscQueue = [];

var playerCardHand = [];
var opponentCardHand = [];

var tableCardHoldA = [];
var tableCardHoldB = [];

// Game UI Buttons
var uiB = [];
// Game UI Text
var uiT = [];

// Game State
var txtBoxA = false;
var txtBoxB = false;
var txtBoxPos = { x:0.28, y:0.205 };
var txtBoxBtxt = null;
// ctx.fillText("LETS GET THIS ROUND STARTED...", 0.28*width, 0.24*height);

// Main Game Process States
const MAIN_STATES = {
    TITLE: 'TITLE',
    OPTIONS: 'OPTIONS',
    CREDITS: 'CREDITS',
    // GAMEINTRO:  'GAMEINTRO',
    GAMEROUND: 'GAMEROUND',
    ENDROUND: 'ENDROUND',
    
    RESET:      'RESET',
    // PAUSE:      'PAUSE'
};
// Game Round Process States
const ROUND_STATES = {
    INTRO: 'INTRO',
    DEAL: 'DEAL',
    PLAY: 'PLAY',
    NEXT: 'NEXT',
    END: 'END',
    
    RESET:      'RESET',
    // PAUSE:      'PAUSE'
};

// State tracking
var stateMain = MAIN_STATES.TITLE;
var statePrev = null;
var stateRound = null;
var stateRPrev = null;
var initRound = true;
var initNext = true;
// Game Chapter (level)
var chapter = 0;
var clickPress = false;

var tableActive = false;
var handActive = false;
var dscActive = false;

// Round settings
var handSize = 5;
var complexity = 0;
var round = 1;
var roundMax = 3;
var roundStart = true;
// playerWin (Round)
var playerWin = false;
var roundEnd = false;
// highlight player hand
var highlight = 0;
var highlightR = 1;

// App Setup
window.onload = function() {
    // canvas setup
    canvas = document.getElementById('canvasMain');
    load = document.getElementById('load');
    ctx = canvas.getContext("2d");
    pad = document.getElementById("drawPad");
    ctp = pad.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    
    // Draw test area 
    ctp.imageSmoothingEnabled = false;

    // Initial flash effect on load
    ctx.fillStyle = '#8888FF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.style.outlineColor  = '#000000';

    setupEventListeners();

    // Generate Sprite Graphics
    // p4 = 3x5
    gpc.setSpriteWH(3,4);
    // Test sprite creation with sprite system
    // const genSprite = gpc.genSpriteImg(0, 1);
    
    for(let i=0; i <= 25; i++) {
        gpc.genSpriteImg(i, p4, 0, 3);
    }
    // Generate/preload number sprites (Image array)
    for(let i=26; i <= 35; i++) {
        gpc.genSpriteImg(i, p4, 0, 4);
    }
        
    // NPC Actors
    gpc.setSpriteWH(32,32);
    // todo replace with for loop for all of pA
    gpc.genSpriteImg(1, pA, 1, 1);
    gpc.genSpriteImg(2, pA, 1, 1);

    // Suit mini icons
    gpc.setSpriteWH(5,6);
    // todo replace with for loop for all of p6
    gpc.genSpriteImg(0, p6, 1, 0);
    gpc.genSpriteImg(1, p6, 2, 0);
    gpc.genSpriteImg(2, p6, 2, 0);
    gpc.genSpriteImg(3, p6, 1, 0);
    
    // Generate mini card graphics    
    // gpc.drawCard(ctp, 28, 38);
    gpc.setSpriteWH(9,12);
    gpc.genSpriteImg(3, pA, 1, 0); // card backing pixel art 7x10, sent to icons
    gpc.genMiniCards(ctp, 9, 12);
    // console.log("Finished generating mini card sprites: " + spriteMinis.length + " generated")

    if(debug) { recalcDebugArrays(); }

    // Delay before kicking off object instances
    setTimeout(() => {
        if(debug) { // Debugs sprite arrays now generated
            gpc.debugArrays();
        }
        uiB = [
            null, // Use up slot 0 for better logic
            new uix(2, 0.395, 0.60, 0.20, 0.05, '#2AF', 'START', null), // 1
            new uix(2, 0.362, 0.7, 0.26, 0.05, '#2AF', 'OPTIONS', null), // 2
            new uix(2, 0.362, 0.8, 0.26, 0.05, '#2AF', 'CREDITS', null), // 3
            new uix(2, 0.05, 0.88, 0.17, 0.05, '#F42', 'BACK', null), // 4
            new uix(2, 0.81, 0.27, 0.16, 0.065, '#6F6', 'CONT', null), // 5
            new uix(2, 0.80, 0.735, 0.16, 0.065, '#6F6', 'NEXT', null), // 6
            new uix(2, 0.28, 0.65, 0.23, 0.04, '#2AF', 'REPLAY', null), // 7
            new uix(2, 0.56, 0.65, 0.15, 0.04, '#FA2', 'EXIT', null), // 8
        ];
        uiT = [
            new uix(1, 0.11, 0.2, 3.5, 0, null, 'JS13K TITLE', null),
            new uix(1, 0.05, 0.5, 1.5, 0, null, 'DSC', null),
            new uix(1, 0.35, 0.2, 2, 0, null, 'OPTIONS', null),
            new uix(1, 0.35, 0.2, 2, 0, null, 'CREDITS', null),
            new uix(1, 0.23, 0.60, 1, 0, null, 'A GAME BY ALEX DELDERFILED', null),
            new uix(1, 0.33, 0.65, 1, 0, null, 'FOR JS13K 2O24', null),
            new uix(1, 0.25, 0.45, 2, 0, null, 'END OF ROUND', null), // 6
            new uix(1, 0.27, 0.55, 2, 0, null, 'PLAYER WINS', null), // 7
            new uix(1, 0.31, 0.55, 2, 0, null, 'GAME OVER', null), // 8
        ];
        deckStack = [
            new card(null, {x: deckPos.x, y: deckPos.y}, {x: deckPos.x, y: deckPos.y}, 0),
            new card(null, {x: deckPos.x+0.005, y: deckPos.y-0.005}, {x: deckPos.x+0.005, y: deckPos.y-0.005}, 0),
            new card(null, {x: deckPos.x+0.010, y: deckPos.y-0.010}, {x: deckPos.x+0.010, y: deckPos.y-0.010}, 0),
            new card(null, {x: deckPos.x+0.015, y: deckPos.y-0.015}, {x: deckPos.x+0.015, y: deckPos.y-0.015}, 0)
        ];
        // Hack to keep game round code via tree shaking
        // stateMain = MAIN_STATES.GAMEROUND;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        load.style.visibility = 'hidden';

        zzfx(...[.2,,582,.02,.02,.05,,.5,,,,,,,36,,,.81,.02]); // Load
        // Draw initial content (if any)
        renderScene();
    }, delayDuration);
}

function getRandomTxt(arr) {
    let str = null;
    if(arr != null) {
        let r = generateNumber(rng, 0, arr.length-1);
        str = arr[r];
    }
    return str;
}

function generateCardsFromDeck(num) {
    // Main game cards (1st round)
    for(let i = 0; i < num; i++) {
        cardGenQueueA[i] = new card('A', deckPos, deckPos, generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));
    }
    if(debug) { recalcDebugArrays(); }
}

function genDebugArray(array, index) {
    // let debugElement = document.querySelector('.debugList');
    if(index == 0) { // table A
        let debugElement0 = document.getElementById('debug0');
    
        if (debugElement0) {
            debugElement0.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug0";
        document.body.appendChild(dbg);
    } else if(index == 1) { // player A
        let debugElement1 = document.getElementById('debug1');
    
        if (debugElement1) {
            debugElement1.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug1";
        document.body.appendChild(dbg);
    } else if (index == 2) { // opponent b
        let debugElement2 = document.getElementById('debug2');
    
        if (debugElement2) {
            debugElement2.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug2";
        document.body.appendChild(dbg);
    } else if (index == 3) { // queue in
        let debugElement3 = document.getElementById('debug3');
    
        if (debugElement3) {
            debugElement3.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug3";
        document.body.appendChild(dbg);
    } else if (index == 4) { // table B
        let debugElement4 = document.getElementById('debug4');
    
        if (debugElement4) {
            debugElement4.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug4";
        document.body.appendChild(dbg);
    } else if (index == 5) { // dscQueue
        let debugElement5 = document.getElementById('debug5');
    
        if (debugElement5) {
            debugElement5.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug5";
        document.body.appendChild(dbg);
    }
}

// Simply counts cards in given array
function countCards(array) {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
        if(array[i] != null) {
            cardNum++;
            deckTotal--;
            count++;
        }
    }
    return count;
}

function checkHoverArea(x, y, dx, dy) {
    return (mouseX >= x && mouseX <= x + dx 
    && mouseY >= y && mouseY <= y + dy);
    // return (mouseX >= width*x && mouseX <= (width*x) + dx 
    // && mouseY >= height*y && mouseY <= (height*y) + dy);
}

// Renders panel areas and dotted outlines 
function renderBacking() {
    
    // Middle grey box
    gpc.drawBox(ctx, 0, 122, width, 255, '#44444440');
    gpc.drawBox(ctx, 0, 112, width, 275, '#44444440');
    // Lower grey
    gpc.drawBox(ctx, 40, 140, 560, 220, '#111111FF');
    gpc.drawBox(ctx, 6, 155, 630, 190, '#111111FF');//edge L grey
    // Center purple
    gpc.drawBox(ctx, 50, 150, 540, 200, '#33224488');
    gpc.drawBox(ctx, 50, 245, 540, 5, '#55555522'); //divider
    gpc.drawOutline(ctx, 50, 150, 540, 200, 1);

    if(tableActive) {
        gpc.drawBox(ctx, 50, 250, 540, 100, '#66666677');
    } else {
        gpc.drawBox(ctx, 50, 250, 540, 100, '#66666611');
    }
    // Score
    gpc.drawBox(ctx, 500, 164, 40, 170, '#332540FF');
    gpc.drawBox(ctx, 505, 180, 30, 20, '#222222FF');
    gpc.drawBox(ctx, 505, 210, 30, 20, '#222222FF');
    gpc.drawBox(ctx, 505, 240, 30, 20, '#222222FF');
    gpc.drawBox(ctx, 505, 270, 30, 20, '#222222FF');
    gpc.drawBox(ctx, 505, 300, 30, 20, '#222222FF');
    
    gpc.drawBox(ctx, 508, 245, 24, 10, '#AA4444CC');
    // Discard pad
    gpc.drawBox(ctx,    22, 164, 55, 170, '#332540FF');
    if(dscActive) {
        gpc.drawBox(ctx,    14, 200, 70, 94, '#FF7777CC'); //red pad
    } else {
        gpc.drawBox(ctx,    14, 200, 70, 94, '#FF555555'); //red pad
    }
    gpc.drawOutline(ctx, 22, 164, 55, 170, 1);

    ctx.globalAlpha = 0.4;
    gpc.renderFont(ctx, 0.065, 0.44, width, height, 1.5, [3])
    gpc.renderFont(ctx, 0.065, 0.50, width, height, 1.5, [18])
    gpc.renderFont(ctx, 0.065, 0.56, width, height, 1.5, [2])
    ctx.globalAlpha = 1;
    // Deck pad
    gpc.drawBox(ctx,    556, 164, 55, 170, '#332540FF');
    gpc.drawBox(ctx,    548, 200, 70, 94, '#55555566'); //grey pad
    gpc.drawBox(ctx,    542, 210, 67, 81, '#00000055'); //deck shadow
    gpc.drawOutline(ctx, 556, 164, 55, 170, 1);
    
    // Player spots
    if(handActive) {
        gpc.drawBox(ctx, 65, 410, 520, 60, '#66666677');
    } else {
        gpc.drawBox(ctx, 65, 410, 520, 60, '#22222270');
    }
    gpc.drawBox(ctx, 265, 7, 320, 65, '#22222270');
    gpc.drawOutline(ctx, 75, 420, 500, 53, 1);
    gpc.drawOutline(ctx, 275, 7, 300, 53, 1);

}

// Render text box B - Opponent
function renderTextBoxB() {
    if(playerWin) {
        gpc.drawBox(ctx, 165, 86, 460, 40, '#CC666688'); //grey red pad
    } else {
        gpc.drawBox(ctx, 165, 86, 460, 40, '#AAAAAA88'); //grey pad
    }
    gpc.drawOutline(ctx, 165, 86, 460, 40, 0);

    ctx.globalAlpha = 0.8;
    ctx.font = "normal bold 22px monospace";
    ctx.fillStyle = '#FFFFFF';

    txtBoxBtxt.render(ctx, width, height);
}

// Add required event listeners
function setupEventListeners() {
    // Event listener to track mouse movement
    canvas.addEventListener('pointermove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        let check = false;

        // Functions ONLY for ROUND_STATES.PLAY
        if(stateRound == ROUND_STATES.PLAY) {
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
            for (let i = 0; i < tableCardHoldA.length; i++) {
                if(tableCardHoldA[i] != null) {
                    if (tableCardHoldA[i].checkHover(mouseX, mouseY, width, height)) {    
                        check = true;
                        currentHover = tableCardHoldA[i];
                        if(currentHeld == null) {
                            tableCardHoldA[i].isHovered = true;
                        }
                    } else {
                        tableCardHoldA[i].isHovered = false;
                    }
                }
            }
            if(check == false) {
                currentHover = null;
            }
        }
    
    });
    canvas.addEventListener('pointerdown', (e) => {
        let check2 = false;
        for (let i = playerCardHand.length; i >= 0; i--) {
            if(playerCardHand[i] != null && currentHover != null) {
                var click = playerCardHand[i].checkClick(true);
                if(click) {
                    currentHeld = [playerCardHand[i], 0];
                    check2 = true;
                    //shuffle card order
                    shuffleCardToTop(playerCardHand, i)
                    // Pickup quick sfx
                    zzfx(...[.2,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
                    return;
                }
            }
        }
        for (let i = tableCardHoldA.length; i >= 0; i--) {
            if(tableCardHoldA[i] != null && currentHover != null) {
                var click = tableCardHoldA[i].checkClick(true);
                if(click) {
                    currentHeld = [tableCardHoldA[i], 1];
                    check2 = true;
                    //shuffle card order
                    shuffleCardToTop(tableCardHoldA, i)
                    // Pickup quick sfx
                    zzfx(...[.2,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
                    return;
                }
            }
        }
        for (let i = 1; i < uiB.length; i++) {
            let checkD = uiB[i].checkClick(true);
            if(checkD) {
                clickPress = i;
                console.log("checkD: for " + i + ' : ' + checkD);
            }
        }
    });
    canvas.addEventListener('pointerup', (e) => {
        for (let i = 0; i < playerCardHand.length; i++) {
            if(playerCardHand[i] != null) {
                playerCardHand[i].checkClick(false);
            }
        }
        for (let i = 0; i < tableCardHoldA.length; i++) {
            if(tableCardHoldA[i] != null) {
                tableCardHoldA[i].checkClick(false);
            }
        }
        if(clickPress != false) { // Handle mouse clicked button 
            zzfx(...[1.2,,9,.01,.02,.01,,2,11,,-305,.41,,.5,3.1,,,.54,.01,.11]); // click
            if(clickPress == 1) { // START
                stateMain = MAIN_STATES.GAMEROUND;
            } else if (clickPress == 2) { // OPTIONS
                stateMain = MAIN_STATES.OPTIONS;
            } else if (clickPress == 3) { // CREDITS
                stateMain = MAIN_STATES.CREDITS;
            } else if (clickPress == 4) { // BACKtoTitle
                stateMain = MAIN_STATES.TITLE;
            } else if (clickPress == 5) { // Continue
                if(stateRound == ROUND_STATES.INTRO) {
                    stateRound = ROUND_STATES.DEAL;
                    setButtons([]); // Disable all buttons
                    txtBoxB = false;
                } else if(stateRound == ROUND_STATES.DEAL) {
                    setButtons([]); // Disable all buttons
                    stateRound = ROUND_STATES.PLAY;
                }
            } else if (clickPress == 6) { // Next
                stateRound = ROUND_STATES.NEXT;
            } else if (clickPress == 7) { // Replay
                setButtons([]); // Disable all buttons
                stateRound = ROUND_STATES.RESET;
                // Start Game Sfx
                zzfx(...[0.6,0,65.40639,.11,.76,.41,1,.7,,,,,.31,,,,,.55,.05,.42]);

            } else if (clickPress == 8) { // Title
                stateRound = ROUND_STATES.RESET;
                stateMain = MAIN_STATES.TITLE;
            }
        }
        // Reset buttons
        clickPress = false;
        for (let i = 1; i < uiB.length; i++) {
            uiB[i].checkClick(false);
        }
        // Drop current held
        if(currentHeld != null) {
            zzfx(...[.3,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
            
            if(stateRound == ROUND_STATES.PLAY) {
                if(tableActive) {
                    moveCardToArray(tableCardHoldA)
                } else if(handActive) {
                    moveCardToArray(playerCardHand)
                } else if(dscActive) {
                    zzfx(...[.8,,81,,.07,.23,3,3,-5,,,,,.1,,.5,,.6,.06,,202]); // Hit Discard
                    discarded++;
                    quaterTrack++;
                    moveCardToArray(dscQueue)

                    // Deck shrink check
                    if(quaterTrack >= quater) {
                        quaterTrack = 0; //reset
                        removeCardFromArray(deckStack, deckStack.length-1);
                    }
                }
            }
            // Reset currentHeld to nothing
            currentHeld = null;
        }
    });
}

// Shuffle given card, in index, to final spot in array
function shuffleCardToTop(array, index) {
    // Remove card at index
    const selectedCard = array.splice(index, 1)[0];
    // Add card back to top of stack with push        
    array.push(selectedCard);

    resetSlots(array);

    if(debug) { recalcDebugArrays(); }
}

function resetSlots(array) {
    // Set slot position to final in array
    for (let i = 0; i < array.length; i++) {
        if(array[i] != null) {
            array[i].setSlotPos(cardASlots[i]);
        }
    }
}
function removeCardFromArray(array, index) {
    array.splice(index, 1);
}

function moveCardToArray(moveTo) {
    if(currentHeld[1] == 0) {  // playerCardHand
        currentHeld[0].resetOnDrop();
        // Add to moveTo array
        moveTo.push(currentHeld[0]);
        let index = playerCardHand.indexOf(currentHeld[0])
        
        // Remove the object from playerCardHand array
        if (index !== -1) {
            playerCardHand.splice(index, 1);
        }
    } else if (currentHeld[1] == 1) { // tableCardHoldA
        currentHeld[0].resetOnDrop();
        // Add to moveTo array
        moveTo.push(currentHeld[0]);
        let index = tableCardHoldA.indexOf(currentHeld[0])
        // Remove the object from playerCardHand array
        if (index !== -1) {
            tableCardHoldA.splice(index, 1);
        }
    }
    if(debug) { recalcDebugArrays(); }
}

// Transfers cards from cardGenQUEUE to Player/Opponent
function cardTransferArray(choose) {
    if(choose) {
        if(cardGenQueueA.length > 0) {
            // Add the card to the playerCardHand
            playerCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            // Set card position in hand
            playerCardHand[playerCardHand.length-1].setSlotPos(cardASlots[playerCardHand.length-1]);
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            // Update card stats
            cardNum++;
            deckTotal--;
            zzfx(...[.6,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
        }
    } else {
        if(cardGenQueueA.length > 0) {
            // Add the card to the opponentCardHand
            opponentCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            // Set card position in hand
            opponentCardHand[opponentCardHand.length-1].setSlotPos(cardBSlots[opponentCardHand.length-1]);
            opponentCardHand[opponentCardHand.length-1].flipCard();
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            // Update card stats
            cardNum++;
            deckTotal--;
            zzfx(...[.6,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
        }
    }
}

function manageStateMain() { 
    switch (stateMain) {
        case MAIN_STATES.TITLE:
            console.log('MAIN_STATES.TITLE State started ...');
            statePrev = stateMain;
            canvas.style.outlineColor  = '#000';
            setButtons([1,2,3]);
                
            break;
        case MAIN_STATES.CREDITS:
            console.log('MAIN_STATES.CREDITS State started ...');
            statePrev = stateMain;
            canvas.style.outlineColor  = '#000';
            setButtons([4]);
            
            break;
        case MAIN_STATES.OPTIONS:
            console.log('MAIN_STATES.OPTIONS State started ...');
            statePrev = stateMain;
            canvas.style.outlineColor  = '#000';
            setButtons([4]);
    
            break;
        case MAIN_STATES.GAMEROUND:
            console.log('MAIN_STATES.GAMEROUND State started ...');
            statePrev = stateMain;
            
            initRound = true; //reset
            stateRound = ROUND_STATES.INTRO; //start game round
            // Start Game Sfx
            zzfx(...[0.6,0,65.40639,.11,.76,.41,1,.7,,,,,.31,,,,,.55,.05,.42]);

            setButtons([]); // Disable all buttons
            
            canvas.style.outlineColor  = '#000';
            
            break;
        case MAIN_STATES.ENDROUND:
            console.log('MAIN_STATES.ENDROUND State started ...');
            statePrev = stateMain;

            setButtons([]); // Disable all buttons

            
            break;
        case MAIN_STATES.RESET:
            console.log('MAIN_STATES.RESET State started ...');
            statePrev = stateMain;
            // StateRunningMain = true;
            // Reset(); //reset for next chapter or back to main menu for game over
            break;

        default:
            console.log('Main State:???? Process in unknown state, return to title');
            stateMain = MAIN_STATES.TITLE; // Default to title
            statePrev = stateMain;
            break;
    }
}

function manageStateRound() { 
    switch (stateRound) {
        case ROUND_STATES.INTRO:
            console.log('ROUND_STATES.INTRO State started ...');
            stateRPrev = stateRound;
            
            // setButtons([]);
            // canvas.style.outlineColor  = '#F00';
                
            break;
        case ROUND_STATES.DEAL:
            console.log('ROUND_STATES.DEAL State started ...');
            stateRPrev = stateRound;
            canvas.style.outlineColor  = '#F00';
            
            setButtons([]);
             
            break;
        case ROUND_STATES.PLAY:
            console.log('ROUND_STATES.DEAL State started ...');
            stateRPrev = stateRound;
            canvas.style.outlineColor  = '#F00';
            
            setButtons([]);
            setTimeout(() => {
                setButtons([6]);
            }, 900);
            highlight = 0.8;
            // Reset card positions
            for(let i = 0; i < playerCardHand.length; i++) {
                if(playerCardHand[i] != null){
                    // console.log("updating settled #" + i + " - " + playerCardHand[i].getRank());
                    playerCardHand[i].setSettled(false);
                }
            }
            // SFX for play START
            zzfx(...[0.75,,37,.06,.01,.36,3,1.8,,,,,,.4,63,.4,,.38,.14,.12,-1600]);
            break;
        case ROUND_STATES.NEXT:
            console.log('ROUND_STATES.NEXT State started ...');
            stateRPrev = stateRound;
            
            setButtons([]);
            if (round < roundMax) {
                initNext = true; // Reset if more rounds left
            } else {
                // setTimeout(() => {
                    stateRound = ROUND_STATES.END;
                // }, 400);
            }
            canvas.style.outlineColor  = '#F00';
            break;
        case ROUND_STATES.END:
            console.log('ROUND_STATES.END State started ...');
            stateRPrev = stateRound;
        
            setButtons([]);
            roundEnd = true;
            playerWin = pro.findWinner(tableCardHoldA, tableCardHoldB);
            // Reset text
            if(playerWin) {
                txtBoxBtxt = new uix(1, txtBoxPos.x, txtBoxPos.y, 1.5, 0, null, getRandomTxt(o4) , null);
            } else {
                txtBoxBtxt = new uix(1, txtBoxPos.x, txtBoxPos.y, 1.5, 0, null, getRandomTxt(o3) , null);
            }
            setTimeout(() => {
                txtBoxB = true;
                // Speech sfx
                zzfx(...[,.3,138,,.03,.03,3,1.8,-18,,2,.04,,.1,16,,,.62,.03]);
            }, 900);
            setTimeout(() => {
                zzfx(...[1.2,,9,.01,.02,.01,,2,11,,-305,.41,,.5,3.1,,,.54,.01,.11]); // click
                setButtons([7,8]);
            }, 2000);

            canvas.style.outlineColor  = '#F00';
            break;

        case ROUND_STATES.RESET:
            console.log('ROUND_STATES.RESET State started ...');
            stateRPrev = stateRound;
            
            // Round settings
            roundEnd = false;
            txtBoxB = false;
            initRound = true;
            roundStart = true;
            round = 1;
            playerWin = false;
            // Game State
            cardNum = 0;
            deckTotal = 52;
            discarded = 0;
            // Reset card arrays
            currentHeld = null;
            playerCardHand = [];
            opponentCardHand = [];
            tableCardHoldA = [];
            tableCardHoldB = [];
            
            // setButtons([]);
            stateRound = ROUND_STATES.INTRO;

            break;

        default:
            console.log('Round State:???? Process in unknown state, return to title');
            console.log('Resetting Game State');
            stateMain = MAIN_STATES.TITLE; // Default to title
            stateRound = ROUND_STATES.RESET; // Default to title
            statePrev = stateMain;
            stateRPrev = stateRound;
            break;
    }
}

// Primary Render Control
function renderScene(timestamp) {
    ctx.clearRect(0, 0, width, height);

    // State function checks
    if(stateMain != statePrev) {
        manageStateMain();
    }
    if(stateRound != stateRPrev) {
        manageStateRound();
    }

    if(stateMain == MAIN_STATES.TITLE) {
        renderTitle();
    } else if (stateMain == MAIN_STATES.CREDITS) {
        renderCredits();
    } else if (stateMain == MAIN_STATES.OPTIONS) {
        renderOptions(timestamp);
    } else if (stateMain == MAIN_STATES.GAMEROUND) {
        renderGame(timestamp);
    } else if (stateMain == MAIN_STATES.ENDROUND) {
        renderEndRound();
    }
    // Request next frame, ie render loop
    requestAnimationFrame(renderScene);
}

function renderGame(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        canvas.style.outlineColor  = '#66c2fb';
    }, delayDuration/2);

    renderBacking();

    // Draw Test #1
    ctx.globalAlpha = 0.8;
    // [font style][font weight][font size][font face]
    ctx.font = "normal bold 22px monospace";
    ctx.fillStyle = '#FFFFFF';
    // ctx.fillText("JS13K 2024 Day VIII", 0.04*width, 0.1*height);
    
    // Draw Test #2
    ctx.font = "normal bold 20px monospace";
    // ctx.fillText("RNG TEST: " + rand, 0.04*width, 0.15*height);
    ctx.fillText("GAME I", 0.04*width, 0.08*height);
    ctx.font = "normal bold 16px monospace";
    ctx.fillText("CARDS SPAWNED: " + cardNum, 0.04*width, 0.13*height);
    ctx.fillText("LEFT IN DECK: " + deckTotal, 0.04*width, 0.16*height);
    ctx.fillText("DISCARDED: " + discarded, 0.04*width, 0.19*height);
    ctx.font = "normal bold 24px monospace";
    ctx.fillStyle = '#66666688';
    ctx.fillText("ROUND   of " + roundMax, 0.15*width, 0.37*height);
    if(highlightR >= 0.05) {
        highlightR -= 0.05;
        ctx.fillStyle = '#FFF';
        ctx.globalAlpha = highlightR;
        ctx.fillText(round, 0.275*width, 0.37*height);
    } else {
        ctx.fillText(round, 0.275*width, 0.37*height);

    }
    
    ctx.globalAlpha = 1.0;
    // Draw Card Deck
    for (let i = 0; i < deckStack.length; i++) {
        if(deckStack[i] != null) {
            deckStack[i].render(ctx, width, height);
        }
    }
    
    // Draw Table A Cards
    for (let i = 0; i < tableCardHoldA.length; i++) {
        if(tableCardHoldA[i] != null) {
            tableCardHoldA[i].render(ctx, width, height);
        }
    }
    
    if(roundEnd) { //blackout area
        gpc.drawBox(ctx, 0, 0, width, height, '#00000099');
        if(playerWin) {
            gpc.drawBox(ctx, 145, 255, 350, 40, '#22AA2266');
        } else {
            gpc.drawBox(ctx, 145, 255, 350, 40, '#AA222266');
        }
    }

    // Draw Player B Cards
    for (let i = 0; i < opponentCardHand.length; i++) {
        if(opponentCardHand[i] != null) {
            opponentCardHand[i].render(ctx, width, height);
        }
    }

    // Draw Player A Cards
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].render(ctx, width, height);
        }
    }
    
    // Draw text boxes
    if(txtBoxB) {
        renderTextBoxB();
    }

    gpc.drawNPC(ctx, 1);

    if(stateRound == ROUND_STATES.INTRO) {
        if(initRound) { // Setup for start of round
            // Get new intro text
            txtBoxBtxt = new uix(1, txtBoxPos.x, txtBoxPos.y, 1.5, 0, null, getRandomTxt(o1) , null);
            // Generate actual cards / RNG starting cards 
            generateCardsFromDeck(handSize*2);
            initRound = false;
        }
        if(roundStart) {
            setTimeout(() => {
                txtBoxB = true;
                // Speech sfx
                zzfx(...[,.3,138,,.03,.03,3,1.8,-18,,2,.04,,.1,16,,,.62,.03]);
            }, 500);
            setTimeout(() => {
                setButtons([5]);
            }, 1000);
            roundStart = false;
        }
        
    } else if (stateRound == ROUND_STATES.DEAL) {
        setTimeout(() => {
            const delayBetweenCards = 150; // 500ms delay between cards
            // if(chooseA) {
            if(timestamp - lastCardCreationTime >= delayBetweenCards) {
                // cardIndexA < cardGenQueueA.length && 
                // console.log("playerCardHand: " + playerCardHand.length);
                // console.log("opponentCardHand: " + opponentCardHand.length);
                if(playerCardHand.length > opponentCardHand.length) {
                    // console.log("TIMER A");
                    cardTransferArray(chooseA);
                    chooseA = false;   
                } else {
                    // console.log("TIMER B");
                    cardTransferArray(chooseA);
                    chooseA = true;
                }
                // moveCardToArray();
                lastCardCreationTime = timestamp;
                if(debug) { recalcDebugArrays(); }
            }
        }, 300);

        // Cards are delt out, toggle to play
        if(cardGenQueueA.length == 0) {
            setTimeout(() => {
                stateRound = ROUND_STATES.PLAY;
            }, 600);
        }

    } else if (stateRound == ROUND_STATES.PLAY) {

        // Check Discard
        let hovD = checkHoverArea(14, 200, 70, 94)
        if(hovD && currentHeld != null) {
            dscActive = true;
            tableActive = false;
            handActive = false;
        } else { // not over discard? check other locations
            dscActive = false;
            // Check table and hand hover states
            let hovT = checkHoverArea(50, 250, 540, 100)
            if(hovT && currentHeld != null) {
                tableActive = true;
            } else {
                tableActive = false;
            }
            let hovH = checkHoverArea(65, 390, 520, 80)
            if(hovH && currentHeld != null) {
                handActive = true;
            } else {
                handActive = false;
            }
        }

        if(highlight >= 0.025) {
            highlight -= 0.025;
            ctx.globalAlpha = highlight;
            gpc.drawBox(ctx, 30, 370, 590, 100, '#22C');
            ctx.globalAlpha = 1.0;
        }
    } else if (stateRound == ROUND_STATES.NEXT) {
        let cardCount = playerCardHand.length + opponentCardHand.length;
        
        if(initNext) {
            round++;
            highlightR = 1.0;
            // Console.log("generate next cards: ");
            if (round <= roundMax) {
                if((cardCount) < handSize*2 ) {
                    generateCardsFromDeck((handSize*2) - cardCount);
                }
                // Reset text
                txtBoxBtxt = new uix(1, txtBoxPos.x, txtBoxPos.y, 1.5, 0, null, getRandomTxt(o2) , null);
                // Reset back to round intro
                setTimeout(() => {
                    roundStart = true;
                    stateRound = ROUND_STATES.INTRO;
                }, 400);
            }
            initNext = false;
        }
    } else if (stateRound == ROUND_STATES.END) {
        // Render end of round text
        uiT[6].render(ctx, width, height);
            
        // Render end of round
        if (playerWin) {
            uiT[7].render(ctx, width, height);
        } else {
            uiT[8].render(ctx, width, height);
        }
    }

    renderButtons();
    debugMouse();
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
                console.log("button activate: " + i);
            }
        }
    }
}

// Draw all buttons
function renderButtons() {
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].render(ctx, width, height);
        uiB[i].checkHover(mouseX, mouseY, width, height);
    }
}

function renderEndRound() {

    
    debugMouse();
}

function renderTitle() {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        canvas.style.outlineColor  = '#66c2fb';
    }, delayDuration/2);

    // Draw Test #1
    ctx.globalAlpha = 0.5;
    gpc.drawBox(ctx, 0, 0, width, height, '#111111EE'); //background
    gpc.drawBox(ctx, 0, 0.155*height, width, height*0.3, '#33333399'); //title
    
    ctx.globalAlpha = 0.9;
    ctx.font = "normal bold 22px monospace";
    ctx.fillStyle = '#FFFFFF';
    
    gpc.renderSuits(ctx, width, height);
    // Draw Test #2
    ctx.font = "normal bold 64px monospace";
    // Title Text 
    uiT[0].render(ctx, width, height);

    ctx.font = "normal bold 22px monospace";
    // ctx.fillText("START", 0.45*width, 0.70*height);
    
    renderButtons();
    debugMouse();
}

function renderOptions() {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        canvas.style.outlineColor  = '#66c2fb';
    }, delayDuration/2);

    // Draw Test #1
    ctx.globalAlpha = 0.8;
    gpc.drawBox(ctx, 0, 0, width, height, '#222222EE'); //bg
    
    uiT[2].render(ctx, width, height);

    renderButtons();
    debugMouse();
}
function renderCredits() {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        canvas.style.outlineColor  = '#66c2fb';
    }, delayDuration/2);

    // Draw Test #1
    ctx.globalAlpha = 0.8;
    gpc.drawBox(ctx, 0, 0, width, height, '#222222EE'); //bg

    uiT[3].render(ctx, width, height);
    uiT[4].render(ctx, width, height);
    uiT[5].render(ctx, width, height);

    renderButtons();
    debugMouse();
}

function debugMouse() {
    // Draw cursor debug location 20x20 Box
    if(currentHeld != null) {
        if(currentHeld[0].getSuit() == 'CLB' || currentHeld[0].getSuit() == 'SPD' ) {
            gpc.drawBox(ctx, mouseX-10, mouseY-10, 20, 20, '#00000080');
        } else if(currentHeld[0].getSuit() == 'DMD' || currentHeld[0].getSuit() == 'HRT' ) {
            gpc.drawBox(ctx, mouseX-10, mouseY-10, 20, 20, '#FF000080');
        }
    } else {
        gpc.drawBox(ctx, mouseX-10, mouseY-10, 20, 20, '#0000FF50');
    }
}

function recalcDebugArrays() {
    genDebugArray(tableCardHoldA, 0);
    genDebugArray(playerCardHand, 1);
    genDebugArray(opponentCardHand, 2);
    genDebugArray(cardGenQueueA, 3);
    genDebugArray(tableCardHoldB, 4);
    genDebugArray(dscQueue, 5);
    // genDebugArray(cardGenQueueB, 4);
}