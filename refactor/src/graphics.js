/////////////////////////////////////////////////////
// Graphical Drawing Functions
/////////////////////////////////////////////////////
import { p4, p6, pA } from './px.js';

// 8-Bit Color Registers
var cREG = ['#FFF', '#000', '#A33', 'A33', '0F0', '', '', '']

// In-memory canvas for graphics processing
const memCanvas = document.createElement('canvas');
const ctg = memCanvas.getContext('2d');

// var cDP = document.getElementById("drawPad");
// var ctp = cDP.getContext('2d');

// SPRITE DATA
var spriteMinis = [];
var spriteIcons = [];
var spriteActors = [];
// image arrays for fontA and fontNumbers
var fnt0 = [];
var fntA = [];

function loadSprites() {
    // NPC Actors
    ctg.canvas.width = 32; ctg.canvas.height = 32;
    genSpriteImg(1, pA, 1, 1);
    genSpriteImg(2, pA, 1, 1);
    // Suit mini icons
    ctg.canvas.width = 5; ctg.canvas.height = 6;
    genSpriteImg(0, p6, 1, 0);
    genSpriteImg(1, p6, 2, 0);
    genSpriteImg(2, p6, 2, 0);
    genSpriteImg(3, p6, 1, 0);
    
    // Generate mini card graphics
    ctg.canvas.width = 9; ctg.canvas.height = 12;
    // ctp.canvas.width = 9; ctp.canvas.height = 12;
    genSpriteImg(3, pA, 1, 0); // card backing pixel art 7x10, sent to icons
    
    // ctp.drawImage(spriteIcons[3], 2, 3, 5, 6);
}

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

// Draws NPC Actor Art
function drawNPC(ctx, i) {
    if(i == 0) {
        drawBox(ctx,    190, 15, 70, 70, '#888888FF'); //grey backing
        drawBox(ctx,    190, 32, 40, 20, '#8888FFAA'); //grey pad
        drawBox(ctx,    198, 18, 55, 56, '#5555FFAA'); //grey pad
        drawBox(ctx,    214, 42, 45, 20, '#8888FFAA'); //grey pad
        drawBox(ctx,    195, 48, 10, 14, '#5555FFAA'); //ear
        drawBox(ctx,    223, 46, 10, 10, '#FFA50066'); //glasses1
        drawBox(ctx,    238, 46, 10, 10, '#FFA50066'); //glasses2
        drawBox(ctx,    198, 75, 50, 10, '#FFFFFFAA'); //white basis
        ctx.drawImage(spriteActors[4], 192, 17, 66, 66);
        drawOutline(ctx, 190, 15, 70, 70, 0);
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
function genMiniCards(w, h) {
    ctg.canvas.width = w;
    ctg.canvas.height = h;
    // ctg.canvas.style.width = w*10 + 'px';
    // ctg.canvas.style.height = h*10 + 'px';
    ctg.clearRect(0, 0, w, h);
    
    //Borders
    ctg.fillStyle = '#555';
    ctg.fillRect(1, 0, w-2, h);
    ctg.fillRect(0, 1, w, h-2);
    
    //Card
    ctg.fillStyle = '#AAA';
    ctg.fillRect(1, 1, w-2, h-2);

    const saveBacking = ctg.canvas.toDataURL("image/png"); 
    const imgBacking = new Image();
    imgBacking.src = saveBacking;

    //delay to give the backing time to process
    //TODO - load things properly
    //TODO - simplify card drawing
    setTimeout(() => {
        for (let i = 0; i <= 7; i++) {
            spriteMinis[i] = new Image();    
            ctg.clearRect(0, 0, w, h);
    
            ctg.drawImage(imgBacking, 0, 0);
            if(i <= 3) {
                //Suit
                // 0 SPD
                // 1 HRT
                // 2 CLB
                // 3 DMD
                ctg.drawImage(spriteIcons[i], 2, 3, 5, 6);
            } else if ( i == 4) { //null
                ctg.fillStyle = '#333';
                ctg.fillRect(2, 5, 3, 2);
                ctg.fillStyle = '#F44';
                ctg.fillRect(5, 5, 2, 2);
            } else if ( i == 5) { //blank
            } else if ( i == 6 || i == 7) { //back of card & deck
                let j = 0; // for deck card shift
                if(i == 7) { // deck
                    j = 1;                    
                    ctg.canvas.width = w+2;
                    ctg.canvas.height = h+2;
                    // ctg.canvas.style.width = w*10 + 'px';
                    // ctg.canvas.style.height = h*10 + 'px';
                    ctg.fillStyle = '#201045'; //deck outline
                    ctg.fillRect(0, 0, w+2, h+2);
                    ctg.fillStyle = '#101025'; //deck side
                    ctg.fillRect(0, 0, 1, h+2);
                    ctg.fillRect(0, h+1, w+2, 1);
                }
                //redraw Borders over darker
                ctg.fillStyle = '#444';
                ctg.fillRect(1+j, 0+j, w-2, h);
                ctg.fillRect(0+j, 1+j, w, h-2);
                //Card center
                ctg.fillStyle = '#888'; //darker
                ctg.fillRect(2+j, 1+j, w-4, h-2);
                ctg.fillRect(1+j, 3+j, w-2, h-6);
                ctg.fillStyle = '#333'; //darkest
                ctg.fillRect(2+j, 3+j, w-4, h-6);

                ctg.drawImage(spriteIcons[4], 0+j, 0+j, 9, 12);
            }
            //return base 64 image data
            let imgCard = ctg.canvas.toDataURL("image/png");
            spriteMinis[i].src = imgCard;
        }
    }, 100);
}

// 28x38 Card Graphics
function drawCard(ctg, w, h) {
    ctg.canvas.width = w;
    ctg.canvas.height = h;
    // ctg.canvas.style.width = w*4 + 'px';
    // ctg.canvas.style.height = h*4 + 'px';
    //test pixel
    // ctg.globalAlpha = 1; //alpha adjust
    ctg.fillStyle = '#555';

    // Top 3 BORDER
    ctg.fillRect(3, 0, w-6, 1);
    ctg.fillRect(2, 1, w-4, 1);
    ctg.fillRect(1, 2, w-2, 1);
    // Bottom 3 BORDER
    ctg.fillRect(1, 35, w-2, 1);
    ctg.fillRect(2, 36, w-4, 1);
    ctg.fillRect(3, 37, w-6, 1);

    // Sides BORDER
    ctg.fillRect(0, 3, 1, 32);
    ctg.fillRect(27, 3, 1, 32);
    
    // INSIDE
    ctg.fillStyle = '#AAA';
    // Top
    ctg.fillRect(3, 1, w-6, 1);
    ctg.fillRect(2, 2, w-4, 1);
    // Bottom
    ctg.fillRect(2, 35, w-4, 1);
    ctg.fillRect(3, 36, w-6, 1);
    
    //Inner segment
    ctg.fillRect(1, 3, w-2, h-6);
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
            ctx.drawImage(image, (x*w) + xPosition, (y*h), letterWidth, letterHeight);
            // Setup for next position
            xPosition += letterWidth + spaceBetweenLetters;
        } else if(value === -1) {
            // Add Space
            xPosition += spaceWidth;
        } else {
            // Draw letter from fntA
            const image = fntA[value];
            ctx.drawImage(image, (x*w) + xPosition, (y*h), letterWidth, letterHeight);
            // Setup for next position
            xPosition += letterWidth + spaceBetweenLetters;
        }
    });

}

// Convert given hex to 8-bit binary
function hexToBinary(hex) {
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}

// Generate Sprite from HEX String
// D10 2022 rewritten sprite system code (rewritten again 2024 js13k)
function genSpriteImg(sNum, ar, c, out) {
    //sprite image
    const img = new Image();
    //clear canvas
    ctg.clearRect(0, 0, ctg.canvas.width, ctg.canvas.height);
    // ctp.clearRect(0, 0, ctp.width, ctp.height);
    //console.log("Decompiling sprite data: [" + px[sNum] + "]");
    let splitData = ar[sNum].split(",");
    //just set to white for now, add colour support later
    if(c) {
        // console.log("select color reg: " + c);
        ctg.fillStyle = cREG[c];
    } else { //default to white
        ctg.fillStyle = cREG[0];
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
                ctg.fillRect(x, y*1, 1, 1);
                // ctp.fillRect(x, y*1, 1, 1);
            }
            x += 1;
            if(x >= ctg.canvas.width) { //next line
                y+=1;
                x=0;
            }
        }
    }

    // Output
    // return base 64 image data
    img.src = ctg.canvas.toDataURL("image/png");
    if(out == 0) {
        spriteIcons[spriteIcons.length] = img;
        // ctp.clearRect(0, 0, ctp.canvas.width, ctp.canvas.height);
        // ctp.drawImage(img, 2, 3, 5, 6);
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

export { loadSprites, drawBox, drawOutline, drawNPC, drawCard, genSpriteImg, genMiniCards, spriteMinis, renderSuits, debugArrays, strToIndex, renderFont };