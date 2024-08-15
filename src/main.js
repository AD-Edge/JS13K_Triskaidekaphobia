//main.js
import { createNumberGenerator, createSeedFromString, generateNumber } from './rng.js';

import card from './card.js';

var html = null;
var body = null;
var canvas = null;
var ctx = null;

var width = 0;
var height = 0;

var rng = null;
var seed = null;
var complex = true;
var rand = null;

var mouseX = -999;
var mouseY = -999;

const flashDuration = 200;

const cardSlot1 = new card(0, {x: 0.45, y: 0.45}, null);

var playerCardHand = [
    cardSlot1,
    null,
    null,
    null,
    null ];
var enemyCardHand = [];

window.onload = function() {
    //Setup
    html = document.documentElement;
    body = document.body;

    //canvas setup
    canvas = document.getElementById('canvasMain');
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    width = canvas.clientWidth;
    height = canvas.clientHeight;

    ctx.fillStyle = '#8888FF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.style.outlineColor  = '#000000';

    //Different ways to use random function
    if(complex) {
        //Non deterministic 
        // Generate a seed based on the current time
        seed = Date.now().toString(); 
    } else {
        //Deterministic
        seed = "ItsGamejamTime"; 
    }

    //rng test   
    //PRNG via ooflorent/example.js
    rng = createNumberGenerator(
        createSeedFromString(seed)
    );
    // let rand = 0;
    rand = generateNumber(rng, -10, 10);

    // Event listener to track mouse movement
    canvas.addEventListener('pointermove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        // Check if the card is hovered
        if (playerCardHand[0].checkHover(mouseX, mouseY, width, height)) {
            playerCardHand[0].isHovered = true;
        } else {
            playerCardHand[0].isHovered = false;
        }

    });

    canvas.addEventListener('pointerdown', (e) => {
        // const rect = canvas.getBoundingClientRect();
        // const mouseX = e.clientX - rect.left;
        // const mouseY = e.clientY - rect.top;
        // console.log("click");

        playerCardHand[0].checkClick(true);
        // drawBox(mouseX, mouseY, '#0000FFFF');
        // Call a function to handle the click event
        // handlePointerClick(mouseX, mouseY);
    });
    canvas.addEventListener('pointerup', (e) => {
        // console.log("click");
        playerCardHand[0].checkClick(false);
    });

    // setTimeout clears the white flash after the specified duration
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw initial content (if any)
        renderScene();
    }, flashDuration);
}

function drawBox(x, y, c) {
    const boxSize = 20;
    ctx.fillStyle = c;
    ctx.fillRect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize);
}

function renderScene() {
    ctx.clearRect(0, 0, width, height);

    // Draw Test #1
    ctx.globalAlpha = 0.8;
    // [font style][font weight][font size][font face]
    ctx.font = "normal bold 16px monospace";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText("JS13K 2024 - Day 2", 0.04*width, 0.1*height);
    
    // Draw Test #2
    ctx.fillText("RNG TEST: " + rand, 0.04*width, 0.15*height);
    
    setTimeout(() => {
        canvas.style.outlineColor  = '#66c2fb';
    }, flashDuration/2);

    //test draw card
    playerCardHand[0].render(ctx, width, height);


    drawBox(mouseX, mouseY, '#FF000080');

    // Request next frame
    requestAnimationFrame(renderScene);
}