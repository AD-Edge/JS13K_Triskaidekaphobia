/////////////////////////////////////////////////////
// Main Game Class
/////////////////////////////////////////////////////
// import './style.css';

import card from './src/card.js';
import * as gpc from './src/graphics.js';
import { p4, p6, pA } from './src/px.js';
import { createNumberGenerator, createSeedFromString, generateNumber } from './src/rng.js';

var mobile, canvas, ctx, pad, ctp, width, height, asp, asp2, rect, rng, seed, currentHover, currentHeld;
var w2 = 720; var h2 = 540;

var mouseX = -999;
var mouseY = -999;

// Setup RNG - Non deterministic seed
seed = Date.now().toString(); 
rng = createNumberGenerator(
    createSeedFromString(seed)
);

// Card position slots
var cardASlots = [
    {x: 0.175, y: 0.84},
    {x: 0.325, y: 0.84},
    {x: 0.475, y: 0.84},
    {x: 0.625, y: 0.84},
    {x: 0.775, y: 0.84},
];
const deckPos = {x: 0.5, y: 0.5};
var playerCardHand = [];

// App Setup
window.onload = function() {
    canvas = document.getElementById('cvs');
    ctx = canvas.getContext("2d");
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    asp = width/height; // Aspect ratio of window
    asp2 = w2/h2; // Aspect ratio of inner canvas

    pad = document.getElementById("drawPad");
    ctp = pad.getContext("2d");
    
    ctx.imageSmoothingEnabled = false;
    ctp.imageSmoothingEnabled = false;
    
    
    console.log("Game Started");
    console.log("Screen Width/Height: " + window.innerWidth + "x" + window.innerHeight);
    console.log("Canvas Inner Resolution: " + canvas.width + "x" + canvas.height);
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
    setupEventListeners();

    // Delay before kicking off object instances
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
 
        playerCardHand[0] = new card('A', deckPos, deckPos, generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));

        // Draw initial content (if any)
        renderScene();
    }, 500);

}

function loadSprites() {
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
    gpc.setSpriteWH(9,12);
    gpc.genSpriteImg(3, pA, 1, 0); // card backing pixel art 7x10, sent to icons
    gpc.genMiniCards(ctp, 9, 12);
}

// Add required event listeners
function setupEventListeners() {
    // Event listener to track mouse movement
    canvas.addEventListener('pointermove', (e) => {
        
        getMousePos(e);

    });
    canvas.addEventListener('pointerdown', (e) => {
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
    canvas.addEventListener('pointercancel', (e) => {
        pointerReleased()
    });
    canvas.addEventListener('pointerup', (e) => {
        pointerReleased()
    });
}

function getMousePos(e) {
    rect = canvas.getBoundingClientRect();
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

    ctx.clearRect(0, 0, width, height);
    // Blue background
    ctx.fillStyle = '#448';
    ctx.fillRect(width*0.125, 0, w2, h2);
    ctx.fillStyle = '#AAF';
    // Test markers
    ctx.fillRect(width*0.125, 0.1*h2, w2*0.01, 10);
    ctx.fillRect(width*0.125, 0.2*h2, w2*0.01, 10);
    ctx.fillRect(width*0.125, 0.5*h2, w2*0.01, 10);
    ctx.fillRect(width*0.125, 0.8*h2, w2*0.01, 10);
    ctx.fillRect(width*0.125, 0.9*h2, w2*0.01, 10);
    
    // Text
    ctx.font = "normal bold 26px monospace";
    ctx.fillText("Test Text", 0.16*width, 0.13*height);
    
    // Draw Player A Cards
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].render(ctx, width, height);
        }
    }
    
    debugMouse();
    // Request next frame, ie render loop
    requestAnimationFrame(renderScene);
}

// Detects values to try to determine if the device is mobile
function isMobile() {
    const isSmallScreen = window.innerWidth <= 767;
    const isTouchDevice = navigator.maxTouchPoints > 0;
    const onTouchStart = 'ontouchstart' in window ;
    console.log("Is SmallScreen: " + isSmallScreen);
    console.log("Is TouchDevice: " + isTouchDevice);
    console.log("onTouchStart: " + onTouchStart);

    return isSmallScreen || isTouchDevice || onTouchStart;
}

// Adjust canvas size to maximum dimensions - for mobile only
function adjustCanvasForMobile() {
    console.log("Scaling Canvas for Mobile");
    // const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    cvs.style.height = window.innerWidth + 'px';
    cvs.style.width = window.innerWidth*asp + 'px';

    //reset
    rect = canvas.getBoundingClientRect();

    console.log("Canvas Inner Resolution: " + canvas.width + "x" + canvas.height);
    console.log("Canvas Width/Height: " + canvas.style.width + " x " + canvas.style.height);
}

function debugMouse() {
    gpc.drawBox(ctx, mouseX-10, mouseY-10, 20, 20, '#0000FF50');
}