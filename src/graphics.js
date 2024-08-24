/////////////////////////////////////////////////////
// Graphical Drawing Functions
/////////////////////////////////////////////////////

// Color registers
var cREG = ["#FFF", "#000", "#A33", "A33", "0F0"]

// SPRITE DATA
var spriteMinis = [];
var spriteIcons = [];
var spriteActors = [];
// image arrays for fontA and fontNumbers
var fnt0 = [];
var fntA = [];

// Draw Canvas
var cDR = document.getElementById("canvasDraw");
var cx = cDR.getContext('2d');
// Sprite W x H 
var sW = 0;
var sH = 0;

//Simple canvas draw functions
function drawBox(ctx, x, y, wd, ht, c) {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, wd, ht);
}
function drawOutline(ctx, x, y, wd, ht, ty) {
    ctx.beginPath();
    if(ty == 0) {
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 4;
        ctx.setLineDash([0, 0]);
        
    } else {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        // Dashed line (5px dash, 5px gap)
        ctx.setLineDash([5, 5]);
    }
    ctx.rect(x, y, wd, ht);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Draws NPC actor
function drawNPC(ctx, i) {
    if(i == 0) {
        gpc.drawBox(ctx,    190, 15, 70, 70, '#888888FF'); //grey backing
        gpc.drawBox(ctx,    190, 32, 40, 20, '#8888FFAA'); //grey pad
        gpc.drawBox(ctx,    198, 18, 55, 56, '#5555FFAA'); //grey pad
        gpc.drawBox(ctx,    214, 42, 45, 20, '#8888FFAA'); //grey pad
        gpc.drawBox(ctx,    195, 48, 10, 14, '#5555FFAA'); //ear
        gpc.drawBox(ctx,    223, 46, 10, 10, '#FFA50066'); //glasses1
        gpc.drawBox(ctx,    238, 46, 10, 10, '#FFA50066'); //glasses2
        gpc.drawBox(ctx,    198, 75, 50, 10, '#FFFFFFAA'); //white basis
        ctx.drawImage(spriteActors[4], 192, 17, 66, 66);
        gpc.drawOutline(ctx, 190, 15, 70, 70, 0);
    } else if (i == 1) {
        drawBox(ctx,    190, 15, 70, 70, '#888888FF'); //grey backing
        drawBox(ctx,    190, 32, 40, 20, '#8888FF77'); //light blue back
        drawBox(ctx,    198, 19, 52, 56, '#AA55AAAA'); //darker blue
        drawBox(ctx,    206, 41, 40, 22, '#FF88AA77'); //light blue front
        drawBox(ctx,    195, 38, 10, 18, '#AA55FFAA'); //ear
        // gpc.drawBox(ctx,    223, 46, 10, 10, '#FFA50066'); //glasses1
        // gpc.drawBox(ctx,    238, 46, 10, 10, '#FFA50066'); //glasses2
        drawBox(ctx,    194, 74, 57, 12, '#FF5588CC'); //white basis
        ctx.drawImage(spriteActors[1], 192, 17, 66, 66);
        drawOutline(ctx, 190, 15, 70, 70, 0);
    }

}

function renderSuits(ctx, w, h) {
    let s = 3;
    ctx.drawImage(spriteIcons[0], w*0.325, h*0.35, 9*s, 12*s);
    ctx.drawImage(spriteIcons[1], w*0.425, h*0.35, 9*s, 12*s);
    ctx.drawImage(spriteIcons[2], w*0.525, h*0.35, 9*s, 12*s);
    ctx.drawImage(spriteIcons[3], w*0.625, h*0.35, 9*s, 12*s);
}

// 9x12 Card Graphics
function genMiniCards(ctp, w, h) {
    
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

    const saveBacking = ctp.canvas.toDataURL("image/png"); 
    const imgBacking = new Image();
    imgBacking.src = saveBacking;

    //delay to give the backing time to process
    //TODO - load things properly
    //TODO - simplify card drawing
    setTimeout(() => {
        for (let i = 0; i <= 7; i++) {
            spriteMinis[i] = new Image();    
            ctp.clearRect(0, 0, w, h);
    
            ctp.drawImage(imgBacking, 0, 0);
            if(i <= 3) {
                //Suit
                // 0 SPD
                // 1 HRT
                // 2 CLB
                // 3 DMD
                ctp.drawImage(spriteIcons[i], 2, 3, 5, 6);    
            } else if ( i == 4) { //null
                ctp.fillStyle = '#333';
                ctp.fillRect(2, 5, 3, 2);
                ctp.fillStyle = '#F44';
                ctp.fillRect(5, 5, 2, 2);
            } else if ( i == 5) { //blank
            } else if ( i == 6 || i == 7) { //back of card & deck
                let j = 0; // for deck card shift
                if(i == 7) { // deck
                    j = 1;                    
                    ctp.canvas.width = w+2;
                    ctp.canvas.height = h+2;
                    ctp.canvas.style.width = w*10 + 'px';
                    ctp.canvas.style.height = h*10 + 'px';
                    ctp.fillStyle = '#201045'; //deck outline
                    ctp.fillRect(0, 0, w+2, h+2);
                    ctp.fillStyle = '#101025'; //deck side
                    ctp.fillRect(0, 0, 1, h+2);
                    ctp.fillRect(0, h+1, w+2, 1);
                }
                //redraw Borders over darker
                ctp.fillStyle = '#444';
                ctp.fillRect(1+j, 0+j, w-2, h);
                ctp.fillRect(0+j, 1+j, w, h-2);
                //Card center
                ctp.fillStyle = '#888'; //darker
                ctp.fillRect(2+j, 1+j, w-4, h-2);
                ctp.fillRect(1+j, 3+j, w-2, h-6);
                ctp.fillStyle = '#333'; //darkest
                ctp.fillRect(2+j, 3+j, w-4, h-6);

                ctp.drawImage(spriteIcons[4], 0+j, 0+j, 9, 12);
            }
            //return base 64 image data
            let imgCard = ctp.canvas.toDataURL("image/png");
            spriteMinis[i].src = imgCard;
        }
    }, 100);
    
    // return img;
}

// 28x38 Card Graphics
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
}

// Convert a string to numbered indexes
function strToIndex(str) {
    str = str.toLowerCase();

    let positions = Array.from(str).map(char => {
        //handle characters
        if (char >= 'a' && char <= 'z') {
            return char.charCodeAt(0) - 'a'.charCodeAt(0);
        } else if (char >= '0' && char <= '9') {
            return -1 - (Number(char));
        } else {
            //everything else, represent with -1
            return -1;
        }
    });

    return positions;
}

function renderFont(ctx, x, y, w, h, s, outputArray) {
    let letterWidth = 10*s;
    let letterHeight = 10*s;
    let spaceBetweenLetters = 4*s; 
    let spaceWidth = letterWidth;
        
    // Starting position for drawing
    let xPosition = 0;

    outputArray.forEach(value => {
        if(value < -1) {
            // Draw number from fnt0
            //  0   8
            // -2  -10
            var index = (-value)-1;
            const image = fnt0[index];
            ctx.drawImage(image, (x*w) + xPosition, (y*w), letterWidth, letterHeight);
            // Setup for next position
            xPosition += letterWidth + spaceBetweenLetters;
        } else if(value === -1) {
            // Add Space
            xPosition += spaceWidth;
        } else {
            // Draw letter from fntA
            const image = fntA[value];
            ctx.drawImage(image, (x*w) + xPosition, (y*w), letterWidth, letterHeight);
            // Setup for next position
            xPosition += letterWidth + spaceBetweenLetters;
        }
    });

}

// Convert given hex to 8-bit binary
function hexToBinary(hex) {
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}

// Dynamic sizing of canvasDraw (helps with debugging)
function setSpriteWH(w, h) {
    sW = w;
    sH = h;
    cDR.width = w;
    cDR.height = h;
    cDR.style.width = w*10 + 'px';
    cDR.style.height = h*10 + 'px';
}
// Generate Sprite from HEX String
// D10 2022 rewritten sprite system code (rewritten again 2024 js13k)
function genSpriteImg(sNum, ar, c, out) {
    //sprite image
    const img = new Image();
    //clear canvas
    cx.clearRect(0, 0, cDR.width, cDR.height);
    //console.log("Decompiling sprite data: [" + px[sNum] + "]");
    let splitData = ar[sNum].split(",");
    //just set to white for now, add colour support later
    if(c) {
        // console.log("select color reg: " + c);
        cx.fillStyle = cREG[c];
    } else { //default to white
        cx.fillStyle = cREG[0];
    }
    // console.log("splitData.length: " + splitData.length);
    // console.log("splitData: " + splitData);
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
                cx.fillRect(x, y*1, 1, 1);
            }
            x += 1;
            if(x >= sW) { //next line
                y+=1;
                x=0;
            }
        }
    }

    // Output
    // return base 64 image data
    img.src = cDR.toDataURL("image/png");
    if(out == 0) {
        spriteIcons[spriteIcons.length] = img;
    } else if (out == 1) {
        spriteActors[spriteActors.length] = img;
    } else if (out == 3) {
        fntA[fntA.length] = img;
    } else if (out == 4) {
        fnt0[fnt0.length] = img;
    }
    return img;
}

function debugArrays() {
    console.log("Finished generating icon sprites: " + spriteIcons.length + " generated")
    console.log("Finished generating actor sprites: " + spriteActors.length + " generated")
    console.log("Finished generating font letter sprites: " + fntA.length + " generated")
    console.log("Finished generating font number sprites: " + fnt0.length + " generated")
    console.log("Finished generating mini card sprites: " + spriteMinis.length + " generated")
}

export { drawBox, drawOutline, drawNPC, drawCard, genSpriteImg, setSpriteWH, genMiniCards, spriteMinis, renderSuits, debugArrays, strToIndex, renderFont };