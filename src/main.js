/////////////////////////////////////////////////////
// Main Game Class
/////////////////////////////////////////////////////

import { createNumberGenerator, createSeedFromString, generateNumber } from './rng.js';
import * as gpc from './graphics.js';
import card from './card.js';
import { debugArray } from './debug.js';
import { zzfx } from './zzfx.js';
import { p4, p6, pA } from './px.js';

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

var debug = false;
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

const cardBCK1 = new card(null, {x: deckPos.x, y: deckPos.y}, {x: deckPos.x, y: deckPos.y}, 0);
const cardBCK2 = new card(null, {x: deckPos.x+0.005, y: deckPos.y-0.005}, {x: deckPos.x+0.005, y: deckPos.y-0.005}, 0);
const cardBCK3 = new card(null, {x: deckPos.x+0.010, y: deckPos.y-0.010}, {x: deckPos.x+0.010, y: deckPos.y-0.010}, 0);
const cardBCK4 = new card(null, {x: deckPos.x+0.015, y: deckPos.y-0.015}, {x: deckPos.x+0.015, y: deckPos.y-0.015}, 0);

var cardGenQueueA = [];
var lastCardCreationTime = 0;
var chooseA = true;

// Card arrays for holding
var playerCardHand = [];
var opponentCardHand = [];

var deck = [
    cardBCK1,
    cardBCK2,
    cardBCK3,
    cardBCK4
];
var tableCardHold = [
    null,
]

// SPRITE DATA
// image arrays for fontA and fontNumbers
var fnt0 = [];
var fntA = [];
var spriteActors = [];
var spriteMinis = [];

var txtBoxA = false;
var txtBoxB = true;

//Setup
window.onload = function() {
    // html = document.documentElement;
    // body = document.body;

    //canvas setup
    canvas = document.getElementById('canvasMain');
    pad = document.getElementById("drawPad");
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    
    //draw test 
    ctp = pad.getContext("2d");
    ctp.imageSmoothingEnabled = false;
    widthP = pad.clientWidth;
    heightP = pad.clientHeight;

    // gpc.drawCard(ctp, widthP, heightP);
    gpc.genMiniCards(ctp, spriteMinis);

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
        fntA[i] = gpc.genSpriteImg(i, p4);
    }
    console.log("Finished generating font letter sprites: " + fntA.length + " generated")
    // Generate/preload number sprites (Image array)
    for(let i=26; i <= 35; i++) {
        fnt0[i-26] = gpc.genSpriteImg(i, p4);
    }
    console.log("Finished generating font number sprites: " + fnt0.length + " generated")
    
    //load sprite actors (Image array)
    gpc.setSpriteWH(8,10);
    spriteActors[0] = gpc.genSpriteImg(0, pA);
    console.log(p6[0]);
    gpc.setSpriteWH(5,6);
    for(let i=1; i <= 5; i++) { 
        spriteActors[i] = gpc.genSpriteImg(0, p6);
    }
    console.log("Finished generating actor sprites: " + spriteActors.length + " generated")


    genInitialCards();

    // Basic count cards
    // countCards(playerCardHand);
    // countCards(opponentCardHand);

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
}

function genInitialCards() {
    for(let i = 0; i < 10; i++) {
        cardGenQueueA[i] = new card('A', deckPos, deckPos, generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));
    }
    // for(let i = 0; i < 5; i++) {
    //     cardGenQueueB[i] = new card('B', deckPos, cardBSlots[i], generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));
    // }
    initCards = true;
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
    // lower grey
    gpc.drawBox(ctx, 40, 140, 560, 220, '#22222270');
    //center purple
    gpc.drawBox(ctx, 50, 150, 540, 200, '#33224488');
    gpc.drawBox(ctx, 50, 245, 540, 5, '#55555522'); //divider
    gpc.drawOutline(ctx, 50, 150, 540, 200, 1);
    //deck pad
    gpc.drawBox(ctx,    556, 164, 55, 170, '#332540FF');
    gpc.drawBox(ctx,    550, 200, 70, 94, '#55555566'); //grey pad
    gpc.drawBox(ctx,    540, 210, 70, 93, '#00000055'); //deck shadow
    gpc.drawOutline(ctx, 556, 164, 55, 170, 1);
    //player spots
    gpc.drawBox(ctx, 65, 410, 520, 60, '#22222270');
    gpc.drawBox(ctx, 265, 7, 320, 65, '#22222270');
    gpc.drawOutline(ctx, 75, 420, 500, 53, 1);
    gpc.drawOutline(ctx, 275, 7, 300, 53, 1);
}

function renderTextBoxB() {
    gpc.drawBox(ctx,    160, 120, 460, 60, '#555555EE'); //grey pad
    gpc.drawBox(ctx,    90, 120, 60, 60, '#777777EE'); //grey pad
    ctx.drawImage(spriteActors[0], 100, 125, 40, 50);

    gpc.drawOutline(ctx, 160, 120, 460, 60, 0);
    gpc.drawOutline(ctx, 90, 120, 60, 60, 0);
}

// Add required event listeners
function setupEventListeners() {
    // Event listener to track mouse movement
    canvas.addEventListener('pointermove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
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

                    //switch current held card to end of array for render ordering - old reorder
                    // var temp = playerCardHand[index1];
                    // playerCardHand[index1] = playerCardHand[index2];
                    // playerCardHand[index2] = temp;
                    
                    // console.log("need to reorder latest dropped card: " + currentHover.printCard());
                    return;
                }
            }
        }
        // if(check2 == false) {
        //     currentHeld = null;
        // }
    });
    canvas.addEventListener('pointerup', (e) => {
        for (let i = 0; i < playerCardHand.length; i++) {
            if(playerCardHand[i] != null) {
                playerCardHand[i].checkClick(false);
            }
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
            // Add the card to the playerCardHand
            opponentCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            //set card position in hand
            opponentCardHand[opponentCardHand.length-1].setSlotPos(cardBSlots[opponentCardHand.length-1]);
            opponentCardHand[opponentCardHand.length-1].flipCard();
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

    // console.log("processing card: " + cardIndex);
    // console.log("playerCardHand size: " + playerCardHand.length);
    // console.log("cardGenQueueA size: " + cardGenQueueA.length);
}

// Render Game Scene
function renderScene(timestamp) {
    ctx.clearRect(0, 0, width, height);

    renderBacking();

    // Draw Test #1
    ctx.globalAlpha = 0.8;
    // [font style][font weight][font size][font face]
    ctx.font = "normal bold 22px monospace";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText("JS13K 2024 Day VII", 0.04*width, 0.1*height);
    
    // Draw Test #2
    ctx.font = "normal bold 16px monospace";
    // ctx.fillText("RNG TEST: " + rand, 0.04*width, 0.15*height);
    ctx.fillText("CARDS SPAWNED: " + cardNum, 0.04*width, 0.15*height);
    ctx.fillText("LEFT IN DECK: " + deckTotal, 0.04*width, 0.18*height);
    
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        canvas.style.outlineColor  = '#66c2fb';
    }, flashDuration/2);

    // Manage card generation
    // Check if it's time to generate a new card
        
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
    // } 

    // console.log("LENGTH OF playercardhand: " + playerCardHand.length);
    // console.log("LENGTH OF opponentcardhadn: " + opponentCardHand.length);
    // console.log("LENGTH OF cardgenqueueA: " + cardGenQueueA.length);
    // console.log("LENGTH OF cardgenqueueB: " + cardGenQueueB.length);
    
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

    // if(currentHover != null) {
    //     console.log("Current hover: " + currentHover.getRank());
    // } else {
    //     console.log("Current hover: null");
    // }

    // Request next frame, ie render loop
    requestAnimationFrame(renderScene);
}