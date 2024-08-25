/////////////////////////////////////////////////////
// Main Game Class
/////////////////////////////////////////////////////
// import './style.css';

import { createNumberGenerator, createSeedFromString, generateNumber } from './src/rng.js';
import * as gpc from './src/graphics.js';
import uix from './src/uix.js';
import card from './src/card.js';
import { debugArray } from './src/debug.js';
import { zzfx } from './src/zzfx.js';
import { p4, p6, pA } from './src/px.js';

// var html = null;
// var body = null;
var canvas = null;
var ctx = null;

var width = 0;
var height = 0;
//draw test
var pad = null;
var ctp = null;
var widthP = 0;
var heightP = 0;

var debug = true;
var rng = null;
var seed = null;
var complex = true;
var rand = null;

var cardNum = 0;
var deckTotal = 52;

var mouseX = -999;
var mouseY = -999;

const flashDuration = 200;

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
var initCards = false;

const deckPos = {x: 0.875, y: 0.450};

var cardASlots = [
    {x: 0.175, y: 0.82},
    {x: 0.325, y: 0.82},
    {x: 0.475, y: 0.82},
    {x: 0.625, y: 0.82},
    {x: 0.775, y: 0.82},
];
var cardBSlots = [
    {x: 0.450, y: 0.04},
    {x: 0.540, y: 0.04},
    {x: 0.630, y: 0.04},
    {x: 0.720, y: 0.04},
    {x: 0.810, y: 0.04},
];

var cardGenQueueA = [];
var lastCardCreationTime = 0;
var chooseA = true;

// Card arrays for holding
var playerCardHand = [];
var opponentCardHand = [];
var deck = [];
var tableCardHold = [
    null,
    null,
    null,
    null,
    null,
]
// Game UI Buttons
var uiB = [
    null, //use up slot 0 for better logic
    new uix(2, 0.395, 0.60, 0.20, 0.05, '#2AF', 'START', null),
    new uix(2, 0.362, 0.7, 0.26, 0.05, '#2AF', 'OPTIONS', null),
    new uix(2, 0.362, 0.8, 0.26, 0.05, '#2AF', 'CREDITS', null),
    new uix(2, 0.05, 0.88, 0.17, 0.05, '#F42', 'BACK', null),
    new uix(2, 0.8, 0.32, 0.16, 0.05, '#6F6', 'CONT', null),
    new uix(2, 0.815, 0.65, 0.16, 0.1, '#6F6', 'NEXT', null),
    new uix(2, 0.03, 0.65, 0.16, 0.1, '#F44', 'DISC', null),
]
// Game UI Text
var uiT = [
    new uix(1, 0.11, 0.2, 3.5, 0, null, 'JS13K TITLE', null),
]

//Game State
//Textbox states
var txtBoxA = false;
var txtBoxB = false;

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
var stateRound = ROUND_STATES.INTRO;
var stateRPrev = null;
var initRound = true;
// Game Chapter (level)
var chapter = 0;
var clickPress = false;

//Setup
window.onload = function() {
    // html = document.documentElement;
    // body = document.body;

    //canvas setup
    canvas = document.getElementById('canvasMain');
    ctx = canvas.getContext("2d");
    pad = document.getElementById("drawPad");
    ctp = pad.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    
    //draw test area 
    ctp.imageSmoothingEnabled = false;
    widthP = pad.clientWidth;
    heightP = pad.clientHeight;

    // initial flash effect on load
    ctx.fillStyle = '#8888FF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.style.outlineColor  = '#000000';

    setupEventListeners();

    // p4 = 3x5
    gpc.setSpriteWH(3,4);
    //test sprite creation with sprite system
    // const genSprite = gpc.genSpriteImg(0, 1);
    
    for(let i=0; i <= 25; i++) {
        gpc.genSpriteImg(i, p4, 0, 3);
    }
    // Generate/preload number sprites (Image array)
    for(let i=26; i <= 35; i++) {
        gpc.genSpriteImg(i, p4, 0, 4);
    }
    
    // Generate Sprite Graphics
    
    // NPC Actors
    gpc.setSpriteWH(32,32);
    //todo replace with for loop for all of pA
    gpc.genSpriteImg(1, pA, 1, 1);
    gpc.genSpriteImg(2, pA, 1, 1);

    // console.log(p6[0]);
    
    // Suit mini icons
    gpc.setSpriteWH(5,6);
    //todo replace with for loop for all of p6
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

    if(debug) {
        genDebugArray(tableCardHold, 0);
        genDebugArray(playerCardHand, 1);
        genDebugArray(opponentCardHand, 2);
        genDebugArray(cardGenQueueA, 3);
        // genDebugArray(cardGenQueueB, 4);
    }

    // setTimeout clears the white flash after the specified duration
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        zzfx(...[.2,,582,.02,.02,.05,,.5,,,,,,,36,,,.81,.02]); // Load
        // Draw initial content (if any)
        
        renderScene();
    }, flashDuration);
    setTimeout(() => {
        if(debug) { //debugs sprite arrays now generated
            gpc.debugArrays();
        }
        //hack to keep game round code via tree shaking
        // stateMain = MAIN_STATES.GAMEROUND;
    }, 700);
}

function genInitialCards() {
    //Main game cards (1st round)
    for(let i = 0; i < 10; i++) {
        cardGenQueueA[i] = new card('A', deckPos, deckPos, generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));
    }
    //Deck Cards
    deck[0] = new card(null, {x: deckPos.x, y: deckPos.y}, {x: deckPos.x, y: deckPos.y}, 0);
    deck[1] = new card(null, {x: deckPos.x+0.005, y: deckPos.y-0.005}, {x: deckPos.x+0.005, y: deckPos.y-0.005}, 0);
    deck[2] = new card(null, {x: deckPos.x+0.010, y: deckPos.y-0.010}, {x: deckPos.x+0.010, y: deckPos.y-0.010}, 0);
    deck[3] = new card(null, {x: deckPos.x+0.015, y: deckPos.y-0.015}, {x: deckPos.x+0.015, y: deckPos.y-0.015}, 0);

    initCards = true;

    if(debug) {
        genDebugArray(cardGenQueueA, 3);
    }
}

function genDebugArray(array, index) {
    // let debugElement = document.querySelector('.debugList');
    if(index == 0) {
        let debugElement0 = document.getElementById('debug0');
    
        if (debugElement0) {
            debugElement0.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug0";
        document.body.appendChild(dbg);
    } else if(index == 1) {
        let debugElement1 = document.getElementById('debug1');
    
        if (debugElement1) {
            debugElement1.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug1";
        document.body.appendChild(dbg);
    } else if (index == 2) {
        let debugElement2 = document.getElementById('debug2');
    
        if (debugElement2) {
            debugElement2.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug2";
        document.body.appendChild(dbg);
    } else if (index == 3) {
        let debugElement3 = document.getElementById('debug3');
    
        if (debugElement3) {
            debugElement3.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug3";
        document.body.appendChild(dbg);
    } else if (index == 4) {
        let debugElement4 = document.getElementById('debug4');
    
        if (debugElement4) {
            debugElement4.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug4";
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

// Renders panel areas and dotted outlines 
function renderBacking() {
    //middle grey box
    gpc.drawBox(ctx, 0, 122, width, 255, '#44444440');
    gpc.drawBox(ctx, 0, 112, width, 275, '#44444440');
    // lower grey
    gpc.drawBox(ctx, 40, 140, 560, 220, '#111111FF');
    //center purple
    gpc.drawBox(ctx, 50, 150, 540, 200, '#33224488');
    gpc.drawBox(ctx, 50, 245, 540, 5, '#55555522'); //divider
    gpc.drawOutline(ctx, 50, 150, 540, 200, 1);
    //deck pad
    gpc.drawBox(ctx,    556, 164, 55, 170, '#332540FF');
    gpc.drawBox(ctx,    550, 200, 70, 94, '#55555566'); //grey pad
    gpc.drawBox(ctx,    542, 210, 67, 81, '#00000055'); //deck shadow
    gpc.drawOutline(ctx, 556, 164, 55, 170, 1);
    //player spots
    gpc.drawBox(ctx, 65, 410, 520, 60, '#22222270');
    gpc.drawBox(ctx, 265, 7, 320, 65, '#22222270');
    gpc.drawOutline(ctx, 75, 420, 500, 53, 1);
    gpc.drawOutline(ctx, 275, 7, 300, 53, 1);
}

function renderTextBoxB() {
    gpc.drawBox(ctx,    160, 88, 460, 60, '#AAAAAA88'); //grey pad
    gpc.drawOutline(ctx, 160, 88, 460, 60, 0);

    ctx.globalAlpha = 0.8;
    ctx.font = "normal bold 22px monospace";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText("LETS GET THIS ROUND STARTED...", 0.28*width, 0.24*height);
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
                    currentHeld = playerCardHand[i];
                    check2 = true;
                    //shuffle card order
                    shuffleCardToTop(playerCardHand, i)

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
        if(clickPress != false) { // Handle mouse clicked button 
            zzfx(...[1.2,,9,.01,.02,.01,,2,11,,-305,.41,,.5,3.1,,,.54,.01,.11]);
            if(clickPress == 1) { // START
                stateMain = MAIN_STATES.GAMEROUND;
            } else if (clickPress == 2) { // OPTIONS
                stateMain = MAIN_STATES.OPTIONS;
            } else if (clickPress == 3) { // CREDITS
                stateMain = MAIN_STATES.CREDITS;
            } else if (clickPress == 4) { // BACKtoTitle
                stateMain = MAIN_STATES.TITLE;
            } else if (clickPress == 5) { // Continue
                console.log("CONTINUE PRESSED");
                if(stateRound == ROUND_STATES.INTRO) {
                    stateRound = ROUND_STATES.DEAL;
                    setButtons([]); //disable all buttons
                    txtBoxB = false;
                } else if(stateRound == ROUND_STATES.DEAL) {
                    setButtons([]); //disable all buttons
                    stateRound = ROUND_STATES.PLAY
                }
            }
        }
        //reset buttons
        clickPress = false;
        for (let i = 1; i < uiB.length; i++) {
            uiB[i].checkClick(false);
        }
        // Drop current held
        if(currentHeld != null) {
            zzfx(...[.3,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
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

    if(debug) {
        genDebugArray(playerCardHand, 1);
    }
}

// Transfers cards from cardGenQUEUE to Player/Opponent
function cardTransferArray(choose) {
    if(choose) {
        if(cardGenQueueA.length > 0) {
            // Add the card to the playerCardHand
            playerCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            //set card position in hand
            playerCardHand[playerCardHand.length-1].setSlotPos(cardASlots[playerCardHand.length-1]);
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            
            // Update card stats
            cardNum++;
            deckTotal--;
            
            // Update the last card creation time & move to the next index
            // lastCardCreationTime = timestamp;
            // zzfx(...[0.25,,362,.02,.03,.09,4,2.8,,,,,.06,.8,,,,.48,.01,.01,-2146]); // Noise pickup
            zzfx(...[.6,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
            
        }
    } else {
        if(cardGenQueueA.length > 0) {
            // Add the card to the opponentCardHand
            // cardGenQueueA[cardGenQueueA.length-1].flipCard();
            opponentCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            //set card position in hand
            opponentCardHand[opponentCardHand.length-1].setSlotPos(cardBSlots[opponentCardHand.length-1]);
            // opponentCardHand[opponentCardHand.length-1].flipCard();
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            
            // Update card stats
            cardNum++;
            deckTotal--;
        
            // Update the last card creation time & move to the next index
            // lastCardCreationTime = timestamp;
            // zzfx(...[0.25,,362,.02,.03,.09,4,2.8,,,,,.06,.8,,,,.48,.01,.01,-2146]); // Noise pickup
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
            initRound = true; //reset
            stateRound = ROUND_STATES.INTRO; //start game round
            //Start Game Sfx
            zzfx(...[1.1,0,65.40639,.11,.76,.41,1,.7,,,,,.31,,,,,.55,.05,.42]);

            setButtons([]); //disable all buttons

            statePrev = stateMain;
            canvas.style.outlineColor  = '#000';
            
            break;
        case MAIN_STATES.ENDROUND:
            console.log('MAIN_STATES.ENDROUND State started ...');
            statePrev = stateMain;

            setButtons([]); //disable all buttons

            
            break;
        case MAIN_STATES.RESET:
            console.log('MAIN_STATES.RESET State started ...');
            statePrev = stateMain;
            // stateRunningMain = true;
            // reset(); //reset for next chapter or back to main menu for game over
            break;

        default:
            console.log('Main State:???? Process in unknown state, return to title');
            stateMain = MAIN_STATES.TITLE; //default to title
            statePrev = stateMain;
            break;
    }
}

function manageStateRound() { 
    switch (stateRound) {
        case ROUND_STATES.INTRO:
            console.log('ROUND_STATES.INTRO State started ...');
            stateRPrev = stateRound;
            // canvas.style.outlineColor  = '#F00';
                
            break;
        case ROUND_STATES.DEAL:
            console.log('ROUND_STATES.DEAL State started ...');
            stateRPrev = stateRound;
            canvas.style.outlineColor  = '#F00';
             
            break;
        case ROUND_STATES.PLAY:
            console.log('ROUND_STATES.DEAL State started ...');
            stateRPrev = stateRound;
            canvas.style.outlineColor  = '#F00';
            setButtons([6,7]);
            zzfx(...[1.2,,37,.06,.01,.36,3,1.8,,,,,,.4,63,.4,,.38,.14,.12,-1600]);
            break;
        case ROUND_STATES.NEXT:
            console.log('ROUND_STATES.NEXT State started ...');
            stateRPrev = stateRound;
            canvas.style.outlineColor  = '#F00';
            break;
        case ROUND_STATES.END:
            console.log('ROUND_STATES.END State started ...');
            stateRPrev = stateRound;
            canvas.style.outlineColor  = '#F00';
            break;

        case ROUND_STATES.RESET:
            console.log('ROUND_STATES.RESET State started ...');
            stateRPrev = stateRound;
            break;

        default:
            console.log('Round State:???? Process in unknown state, return to title');
            console.log('Resetting Game State');
            stateMain = MAIN_STATES.TITLE; //default to title
            stateRound = ROUND_STATES.RESET; //default to title
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
    }, flashDuration/2);

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
    ctx.fillText("ROUND I", 0.04*width, 0.08*height);
    ctx.font = "normal bold 16px monospace";
    ctx.fillText("CARDS SPAWNED: " + cardNum, 0.04*width, 0.13*height);
    ctx.fillText("LEFT IN DECK: " + deckTotal, 0.04*width, 0.16*height);
    
    ctx.globalAlpha = 1.0;
    // Draw Card Deck
    for (let i = 0; i < deck.length; i++) {
        if(deck[i] != null) {
            deck[i].render(ctx, width, height);
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
    //draw text boxes
    if(txtBoxB) {
        renderTextBoxB();
    }

    gpc.drawNPC(ctx, 1);


    if(stateRound == ROUND_STATES.INTRO) {
        if(initRound) { // setup for start of round
            setTimeout(() => {
                txtBoxB = true;
                // speech sfx
                zzfx(...[,.85,138,,.03,.03,3,1.8,-18,,2,.04,,.1,16,,,.62,.03]);
            }, 500);
            setTimeout(() => {
                setButtons([5]);
            }, 1000);
            // Generate actual cards / RNG starting cards 
            genInitialCards();
            initRound = false;
        }
        
    } else if (stateRound == ROUND_STATES.DEAL) {
        setTimeout(() => {
            const delayBetweenCards = 150; // 500ms delay between cards
        // if(chooseA) {
        if(timestamp - lastCardCreationTime >= delayBetweenCards) {
            // cardIndexA < cardGenQueueA.length && 
            if(chooseA) {
                // console.log("TIMER A");
                cardTransferArray(chooseA);
                chooseA = !chooseA;   
            } else {
                // console.log("TIMER B");
                cardTransferArray(chooseA);
                chooseA = !chooseA;
            }
            // moveCardToArray();
            lastCardCreationTime = timestamp;
            if(debug) {
                genDebugArray(playerCardHand, 1);
                genDebugArray(opponentCardHand, 2);
                genDebugArray(cardGenQueueA, 3);
                // genDebugArray(cardGenQueueB, 4);
            }
        }
        }, 300);

        // Cards are delt out, toggle to play
        if(cardGenQueueA.length == 0) {
            // Need to check all buttons regardless of scene
            setTimeout(() => {
                stateRound = ROUND_STATES.PLAY;
            }, 600);
        }

    } else if (stateRound == ROUND_STATES.PLAY) {

    
    }

    // Draw all buttons
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].render(ctx, width, height);
        uiB[i].checkHover(mouseX, mouseY, width, height);
    }
    debugMouse();
}

// Activates all buttons in actAr
// TODO do this without nesting for loops
function setButtons(actAr) {
    //disable all buttons
    for (let i = 1; i < uiB.length; i++) { 
        uiB[i].togActive(false);
    }
    //reactivate specified
    for (let i = 1; i < uiB.length; i++) { //check if button should be active
        for (let j = 0; j < actAr.length; j++) { //check if button should be active
            if (actAr[j] === i) {
                uiB[i].togActive(true);
                console.log("button activate: " + i);
            }
        }
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
    }, flashDuration/2);

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
    
    // Need to check all buttons regardless of scene
    for (let i = 1; i < uiB.length; i++) { 
        uiB[i].render(ctx, width, height);
        uiB[i].checkHover(mouseX, mouseY, width, height);
    }

    debugMouse();
}

function renderOptions() {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        canvas.style.outlineColor  = '#66c2fb';
    }, flashDuration/2);

    // Draw Test #1
    ctx.globalAlpha = 0.8;
    gpc.drawBox(ctx, 0, 0, width, height, '#222222EE'); //bg
    // gpc.drawBox(ctx, 0, 0.155*height, width, height*0.3, '#33333399'); //title
    
    ctx.font = "normal bold 32px monospace";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText("OPTIONS", 0.22*width, 0.28*height);    

    // Need to check all buttons regardless of scene
    for (let i = 1; i < uiB.length; i++) { 
        uiB[i].render(ctx, width, height);
        uiB[i].checkHover(mouseX, mouseY, width, height);
    }
    
    debugMouse();
}
function renderCredits() {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        canvas.style.outlineColor  = '#66c2fb';
    }, flashDuration/2);

    // Draw Test #1
    ctx.globalAlpha = 0.8;
    gpc.drawBox(ctx, 0, 0, width, height, '#222222EE'); //bg
    // gpc.drawBox(ctx, 0, 0.155*height, width, height*0.3, '#33333399'); //title

    ctx.font = "normal bold 32px monospace";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText("CREDITS", 0.22*width, 0.28*height);    

    // Need to check all buttons regardless of scene
    for (let i = 1; i < uiB.length; i++) { 
        uiB[i].render(ctx, width, height);
        uiB[i].checkHover(mouseX, mouseY, width, height);
    }
    
    debugMouse();
}

function debugMouse() {
    //draw cursor debug location 20x20 Box
    if(currentHeld != null) {
        if(currentHeld.getSuit() == 'CLB' || currentHeld.getSuit() == 'SPD' ) {
            gpc.drawBox(ctx, mouseX-10, mouseY-10, 20, 20, '#00000080');
        } else if(currentHeld.getSuit() == 'DMD' || currentHeld.getSuit() == 'HRT' ) {
            gpc.drawBox(ctx, mouseX-10, mouseY-10, 20, 20, '#FF000080');
        }
    } else {
        gpc.drawBox(ctx, mouseX-10, mouseY-10, 20, 20, '#0000FF50');
    }
}