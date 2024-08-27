/////////////////////////////////////////////////////
// Main Game Class
/////////////////////////////////////////////////////
// import './style.css';

var canvas, ctx;
var width, height;
var w2 = 720;

// App Setup
window.onload = function() {
    // canvas setup
    canvas = document.getElementById('canvasMain');
    ctx = canvas.getContext("2d");
    width = canvas.clientWidth;
    height = canvas.clientHeight;

    console.log("Game Started");

    ctx.fillStyle = '#448';
    ctx.fillRect(width*0.125, 0, w2, height);

}