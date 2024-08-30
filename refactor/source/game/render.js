/////////////////////////////////////////////////////
// Render Functions
/////////////////////////////////////////////////////

function renderGame() {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);


}
function renderTitle() {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    cx.globalAlpha = 0.5;
    drawBox(cx, 0, 0, w, h, '#111111EE'); //background
    drawBox(cx, 0, 0.155*h, w, h*0.3, '#33333399'); //title
    
    cx.globalAlpha = 0.9;
    cx.font = "normal bold 22px monospace";
    cx.fillStyle = '#FFFFFF';
    
    // console.log("spritesIcons array size: " + spriteIcons.length);

    renderSuits();
    // renderSuits(cx, w, h);
    // Title Text 
    // uiT[0].render(cx, w, h);

    cx.font = "normal bold 22px monospace";
    cx.fillText("TITLE", 0.45*w, 0.25*h);
    
    // renderButtons();
}

function renderOptions() {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    // Draw Test #1
    cx.globalAlpha = 0.8;
    drawBox(cx, 0, 0, w, h, '#222222EE'); //bg
    
    // uiT[2].render(cx, w, h);

    // renderButtons();
}
function renderCredits() {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    // Draw Test #1
    cx.globalAlpha = 0.8;
    drawBox(cx, 0, 0, w, h, '#222222EE'); //bg

    // uiT[3].render(cx, w, h);
    // uiT[4].render(cx, w, h);
    // uiT[5].render(cx, w, h);

    // renderButtons();
}