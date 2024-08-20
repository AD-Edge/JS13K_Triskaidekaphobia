/////////////////////////////////////////////////////
// Graphical Drawing Functions
/////////////////////////////////////////////////////

//colour registers
var cREG = ["#FFF", "#000", "#A33", "", "", "", ""]

var spriteMinis = [];


function drawBox(ctx, x, y, wd, ht, c) {
    // const boxSize = 20;
    ctx.fillStyle = c;
    ctx.fillRect(x, y, wd, ht);
}

function drawOutline(ctx, x, y, wd, ht, ty) {
    ctx.beginPath();
    // Set the dashed line pattern (e.g., 5px dash, 5px gap)
    if(ty == 0) {
        ctx.setLineDash([0, 0]);

    } else {
        ctx.setLineDash([5, 5]);
    }
    // Set the stroke color (white in this case)
    ctx.strokeStyle = 'white';
    // Draw the rectangle
    ctx.rect(x, y, wd, ht);
    // Apply the stroke to draw the dashed outline
    ctx.stroke();
    // Reset the line dash pattern to solid (optional, for future drawings)
    ctx.setLineDash([]);
}

// 9x12 Cards
function genMiniCards(ctp, actArr, w, h) {
    const img = new Image();
    
    ctp.canvas.width = w;
    ctp.canvas.height = h;
    ctp.canvas.style.width = w*10 + 'px';
    ctp.canvas.style.height = h*10 + 'px';
    ctp.clearRect(0, 0, w, h);
    
    //Borders
    ctp.fillStyle = '#555';
    ctp.fillRect(1, 0, w-2, h);
    ctp.fillRect(0, 1, w, h-2);
    
    //Card
    ctp.fillStyle = '#AAA';
    ctp.fillRect(1, 1, w-2, h-2);

    //Suit
    ctp.drawImage(actArr[2], 2, 3, 5, 6);

    //return base 64 image data
    img.src = ctp.canvas.toDataURL("image/png");

    spriteMinis[0] = img;
    console.log("Finished generating mini card sprites: " + spriteMinis.length + " generated")
    // return img;
}

function drawCard(ctp, w, h) {
    ctp.canvas.width = w;
    ctp.canvas.height = h;
    ctp.canvas.style.width = w*4 + 'px';
    ctp.canvas.style.height = h*4 + 'px';
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

    // for(let i = 3; i < h-3; i++) {
    // }

}


function hexToBinary(hex) {
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}

var cDR = document.getElementById("canvasDraw");
var cx = cDR.getContext('2d');

// Sprite W x H 
var sW = 0;
var sH = 0;
function setSpriteWH(w, h) {
    sW = w;
    sH = h;
    cDR.width = w;
    cDR.height = h;
    cDR.style.width = w*10 + 'px';
    cDR.style.height = h*10 + 'px';
}
// D10 rewritten sprite system code
//Before kicking off queue, use this image instead
function genSpriteImg(sNum, ar, c) {
    //sprite image
    const img = new Image();
    //clear canvas
    cx.clearRect(0, 0, cDR.width, cDR.height);
    //console.log("Decompiling sprite data: [" + px[sNum] + "]");
    let splitData = ar[sNum].split(",");
    //just set to white for now, add colour support later
    if(c) {
        cx.fillStyle = cREG[c];
    } else { //default to white
        cx.fillStyle = cREG[0];
    }
    // console.log("splitData.length: " + splitData.length);
    // console.log("splitData: " + splitData);
    //skip 1st 2 values (dimensions of pixel art)
    // sW = splitData[0];
    // sH = splitData[1];
    // console.log("Sprite dimensions: " + sW + " width, " + sH + " height");

    let x = 0;
    let y = 0;
    //iterate over every pixel value, pixels
    for(var i=0; i < splitData.length; i++) { 
        //convert each hex element into binary
        let bRow = hexToBinary(splitData[i]);
        //bin[bin.length] = hex;
        // console.log("Sprite HEX -> Binary: " + bRow);
        
        for (var j = 0; j < bRow.length; j++) { //iterate over binary
            if (bRow[j]==1) { //check for pixel value
                // console.log("Drawing row[j]: " + j);
                // cx.fillRect(j*pxW, (i-2)*pxW, pxW, pxW);
                cx.fillRect(x, y*1, 1, 1);
            }
            x += 1;
            if(x >= sW) { //next line
                y+=1;
                x=0;
            }
        }
        
        // for (var j = 0; j < bRow.length; j++) {
        //     if (bRow[j]==1) { //check for pixel value
        //         console.log("Drawing row[j]: " + bRow[j]);
        //         cx.fillRect(j*pxW, (i-2)*pxW, pxW, pxW);
        //     }
        // }
    }
    //return base 64 image data
    img.src = cDR.toDataURL("image/png");
    return img;
}

export { drawBox, drawOutline, drawCard, genSpriteImg, setSpriteWH, genMiniCards, spriteMinis };