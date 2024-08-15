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

export { drawBox, drawDashBox };