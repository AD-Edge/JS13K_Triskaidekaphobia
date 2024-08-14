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

window.onload = function() {

    //Setup
    html = document.documentElement;
    body = document.body;

    //canvas setup
    canvas = document.getElementById('canvasMain');
    ctx = canvas.getContext("2d");
    width = canvas.clientWidth;
    height = canvas.clientHeight;

    // Draw Test #1
    ctx.globalAlpha = 0.8;
    // [font style][font weight][font size][font face]
    ctx.font = "normal bold 14px monospace";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText("JS13K 2024", 0.1*width, 0.2*height);
    
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
    ctx.fillText("RNG TEST: " + rand, 0.1*width, 0.85*height);
}