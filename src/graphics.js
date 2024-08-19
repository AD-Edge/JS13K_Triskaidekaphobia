/////////////////////////////////////////////////////
// Graphical Drawing Functions
/////////////////////////////////////////////////////

function drawBox(ctx, x, y, wd, ht, c) {
    // const boxSize = 20;
    ctx.fillStyle = c;
    ctx.fillRect(x, y, wd, ht);
}

function drawDashBox(ctx, x, y, wd, ht) {
    ctx.beginPath();
    // Set the dashed line pattern (e.g., 5px dash, 5px gap)
    ctx.setLineDash([5, 5]);
    // Set the stroke color (white in this case)
    ctx.strokeStyle = 'white';
    // Draw the rectangle
    ctx.rect(x, y, wd, ht);
    // Apply the stroke to draw the dashed outline
    ctx.stroke();
    // Reset the line dash pattern to solid (optional, for future drawings)
    ctx.setLineDash([]);
}

function drawCard(ctp, widthP, heightP) {
    
    console.log(widthP);
    console.log(heightP);
    //test pixel
    let w = ctp.canvas.width;
    let h = ctp.canvas.height;
    console.log(w);
    console.log(h);
    //test pixel
    // ctp.globalAlpha = 1; //alpha adjust
    ctp.fillStyle = '#555';

    // Top 3 BORDER
    ctp.fillRect(3, 0, w-6, 1);
    ctp.fillRect(2, 1, w-4, 1);
    ctp.fillRect(1, 2, w-2, 1);
    // Bottom 3 BORDER
    ctp.fillRect(1, 35, w-2, 1);
    ctp.fillRect(2, 36, w-4, 1);
    ctp.fillRect(3, 37, w-6, 1);

    // Sides BORDER
    ctp.fillRect(0, 3, 1, 32);
    ctp.fillRect(27, 3, 1, 32);
    
    // INSIDE
    ctp.fillStyle = '#AAA';
    // Top
    ctp.fillRect(3, 1, w-6, 1);
    ctp.fillRect(2, 2, w-4, 1);
    // Bottom
    ctp.fillRect(2, 35, w-4, 1);
    ctp.fillRect(3, 36, w-6, 1);
    
    //Inner segment
    ctp.fillRect(1, 3, w-2, h-6);


    // function which takes in strings, strings have: 
    // square coords, x start, y start, x length, y length, 
    // color swap 


    for(let i = 3; i < h-3; i++) {
    }


    // ctp.fillRect(31, 0, 1, 1);
}

export { drawBox, drawDashBox, drawCard };