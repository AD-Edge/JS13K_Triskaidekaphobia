//main.js
import { createNumberGenerator, createSeedFromString, generateNumber } from './rng.js';

var html = null;
var body = null;
var canvas = null;
var ctx = null;

var width = 0;
var height = 0;

var rng = null;
var seed = null;
var complex = true;

const flashDuration = 200;

window.onload = function() {
    //Setup
    html = document.documentElement;
    body = document.body;

    //canvas setup
    canvas = document.getElementById('canvasMain');
    ctx = canvas.getContext("2d");
    width = canvas.clientWidth;
    height = canvas.clientHeight;

    ctx.fillStyle = '#8888FF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.style.outlineColor  = '#000000';

    // setTimeout clears the white flash after the specified duration
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw initial content (if any)
        drawTestContent(ctx);
    }, flashDuration);
}

function drawTestContent() {
    // Draw Test #1
    ctx.globalAlpha = 0.8;
    // [font style][font weight][font size][font face]
    ctx.font = "normal bold 16px monospace";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText("JS13K 2024", 0.04*width, 0.1*height);
    
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
    var rand = generateNumber(rng, -10, 10);
    // Draw Test #2
    ctx.fillText("RNG TEST: " + rand, 0.04*width, 0.15*height);
    
    setTimeout(() => {
        canvas.style.outlineColor  = '#66c2fb';
    }, flashDuration/2);
}