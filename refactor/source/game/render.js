/////////////////////////////////////////////////////
// Render Functions
/////////////////////////////////////////////////////

function renderTitle() {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    // Draw Test #1
    cx.globalAlpha = 0.5;
    drawBox(cx, 0, 0, width, height, '#111111EE'); //background
    drawBox(cx, 0, 0.155*height, width, height*0.3, '#33333399'); //title
    
    cx.globalAlpha = 0.9;
    cx.font = "normal bold 22px monospace";
    cx.fillStyle = '#FFFFFF';
    
    renderSuits(cx, width, height);
    // Title Text 
    // uiT[0].render(cx, width, height);

    cx.font = "normal bold 22px monospace";
    cx.fillText("TITLE", 0.45*width, 0.25*height);
    
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
    drawBox(cx, 0, 0, width, height, '#222222EE'); //bg
    
    // uiT[2].render(cx, width, height);

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
    drawBox(cx, 0, 0, width, height, '#222222EE'); //bg

    // uiT[3].render(cx, width, height);
    // uiT[4].render(cx, width, height);
    // uiT[5].render(cx, width, height);

    // renderButtons();
}