/////////////////////////////////////////////////////
// Debug Functions
/////////////////////////////////////////////////////

function debugMouse() {
    drawBox(cx, mouseX-10, mouseY-10, 20, 20, '#0000FF50');
}

function renderDebug() {
    // Blue background
    cx.fillStyle = '#448';
    cx.fillRect(width*0.125, 0, w2, h2);
    cx.fillStyle = '#AAF';
    // Test markers
    cx.fillRect(width*0.125, 0.1*h2, w2*0.01, 10);
    cx.fillRect(width*0.125, 0.2*h2, w2*0.01, 10);
    cx.fillRect(width*0.125, 0.5*h2, w2*0.01, 10);
    cx.fillRect(width*0.125, 0.8*h2, w2*0.01, 10);
    cx.fillRect(width*0.125, 0.9*h2, w2*0.01, 10);
    
    // Text
    cx.font = "normal bold 26px monospace";
    cx.fillText("JS13K", 0.16*width, 0.13*height);
    
    cx.fillStyle = '#113';
    if(mobile) {
        cx.fillText("[MOBILE]", 0.25*width, 0.13*height);
    } else {
        cx.fillText("[BROWSER]", 0.25*width, 0.13*height);
    }
    
    // Draw Player A Cards
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].render(cx, width, height);
        }
    }   
}