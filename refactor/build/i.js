/////////////////////////////////////////////////////
// Global Variables
/////////////////////////////////////////////////////
// import './style.css';

var mobile, cvs, cx, width, height, asp, asp2, rect, rng, seed, currentHover, currentHeld, mouseX, mouseY;
var w2 = 720; var h2 = 540;

var debug = true;

// Setup RNG - Non deterministic seed
seed = Date.now().toString(); 
rng = createNumberGenerator(
    createSeedFromString(seed)
);

// Card position slots
var cardASlots = [
    {x: 0.175, y: 0.84},
    {x: 0.325, y: 0.84},
    {x: 0.475, y: 0.84},
    {x: 0.625, y: 0.84},
    {x: 0.775, y: 0.84},
];
const deckPos = {x: 0.5, y: 0.5};
var playerCardHand = [];

// 8-Bit Color Registers
var cREG = ['#FFF', '#000', '#A33', 'A33', '0F0', '', '', '']

// In-memory canvas for graphics processing
const mCvs = document.createElement('canvas');
const cg = mCvs.getContext('2d');

// var cDP = document.getElementById("drawPad");
// var ctp = cDP.getContext('2d');

// SPRITE DATA
var sprM = [];
var spriteIcons = [];
var spriteActors = [];
// image arrays for fontA and fontNumbers
var fnt0 = [];
var fntA = [];
/////////////////////////////////////////////////////
// Index Main
/////////////////////////////////////////////////////

// App Setup
window.onload = function() {
    initSetup();
    loadSprites();
    setTimeout(() => {
        genMiniCards(9, 12);
    }, 300);
    setupEventListeners();
    setTimeout(() => {
        playerCardHand[0] = new card('A', deckPos, deckPos, generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));
        if(debug) { // Debugs sprite arrays now generated
            debugArrays();
        }
        // Draw canvas backing
        cx.clearRect(0, 0, cvs.width, cvs.height);
        cx.fillStyle = '#111';
        cx.fillRect(0, 0, cvs.width, cvs.height);
        // Draw initial content (if any)
        renderScene();
    }, 500);

}

function initSetup() {
    cvs = document.getElementById('cvs');
    cx = cvs.getContext("2d");
    width = cvs.clientWidth;
    height = cvs.clientHeight;
    asp = width/height; // Aspect ratio of window
    asp2 = w2/h2; // Aspect ratio of inner cvs
    // pad = document.getElementById("drawPad");
    // ctp = pad.getContext("2d");
    // ctp.imageSmoothingEnabled = false;
    cx.imageSmoothingEnabled = false;
    
    // Initial flash effect on load
    cx.fillStyle = '#88F';
    cx.fillRect(0, 0, cvs.width, cvs.height);
    cvs.style.outlineColor  = '#000000';
    cx.fillStyle = '#000';
    cx.font = "normal bold 24px monospace";
    // cx.fillText("LOADING... " + "?%", 0.05*width, 0.9*height);
    cx.fillText("LOADING... ", 0.05*width, 0.9*height);

    console.log("Game Started");
    console.log("Screen Width/Height: " + window.innerWidth + "x" + window.innerHeight);
    console.log("cvs Inner Resolution: " + cvs.width + "x" + cvs.height);
    console.log("Aspect Ratio: " + asp);
    console.log("Aspect Ratio2: " + asp2);
    
    mobile = isMobile();
    if (mobile) {
        adjustCanvasForMobile();
        console.log("[Mobile Mode]");
    } else {
        console.log("[Browser Mode]");
    }
    
}

// Primary Render Control
function renderScene(timestamp) {
    cx.clearRect(0, 0, width, height);
    
    renderDebug(cx);
    // Timeout for flash
    setTimeout(() => {
        cvs.style.outlineColor  = '#66c2fb';
    }, 100);

    debugMouse();

    // Request next frame, ie render loop
    requestAnimationFrame(renderScene);
}
/////////////////////////////////////////////////////
// Graphical Drawing Functions
/////////////////////////////////////////////////////

function loadSprites() {
    // NPC Actors
    cg.canvas.width = 32; cg.canvas.height = 32;
    genSpriteImg(1, pA, 1, spriteActors);
    genSpriteImg(2, pA, 1, spriteActors);
    // Suit mini icons
    cg.canvas.width = 5; cg.canvas.height = 6;
    genSpriteImg(0, p6, 1, spriteIcons);
    genSpriteImg(1, p6, 2, spriteIcons);
    genSpriteImg(2, p6, 2, spriteIcons);
    genSpriteImg(3, p6, 1, spriteIcons);
    
    // Generate mini card graphics
    cg.canvas.width = 9; cg.canvas.height = 12;
    // ctp.canvas.width = 9; ctp.canvas.height = 12;
    genSpriteImg(3, pA, 1, spriteIcons); // card backing pixel art 7x10, sent to icons
    
    // ctp.drawImage(spriteIcons[3], 2, 3, 5, 6);
}

//Simple canvas draw functions
function drawBox(cx, x, y, wd, ht, c) {
    cx.fillStyle = c;
    cx.fillRect(x, y, wd, ht);
}
function drawOutline(cx, x, y, wd, ht, ty) {
    cx.beginPath();
    if(ty == 0) {
        cx.strokeStyle = '#444';
        cx.lineWidth = 4;
        cx.setLineDash([0, 0]);
        
    } else {
        cx.strokeStyle = 'white';
        cx.lineWidth = 1;
        // Dashed line (5px dash, 5px gap)
        cx.setLineDash([5, 5]);
    }
    cx.rect(x, y, wd, ht);
    cx.stroke();
    cx.setLineDash([]);
}

// Draws NPC Actor Art
function drawNPC(cx, i) {
    if(i == 0) {
        drawBox(cx,    190, 15, 70, 70, '#888888FF'); //grey backing
        drawBox(cx,    190, 32, 40, 20, '#8888FFAA'); //grey pad
        drawBox(cx,    198, 18, 55, 56, '#5555FFAA'); //grey pad
        drawBox(cx,    214, 42, 45, 20, '#8888FFAA'); //grey pad
        drawBox(cx,    195, 48, 10, 14, '#5555FFAA'); //ear
        drawBox(cx,    223, 46, 10, 10, '#FFA50066'); //glasses1
        drawBox(cx,    238, 46, 10, 10, '#FFA50066'); //glasses2
        drawBox(cx,    198, 75, 50, 10, '#FFFFFFAA'); //white basis
        cx.drawImage(spriteActors[4], 192, 17, 66, 66);
        drawOutline(cx, 190, 15, 70, 70, 0);
    } else if (i == 1) {
        drawBox(cx,    190, 15, 70, 70, '#888888FF'); //grey backing
        drawBox(cx,    190, 32, 40, 20, '#8888FF77'); //light blue back
        drawBox(cx,    198, 19, 52, 56, '#AA55AAAA'); //darker blue
        drawBox(cx,    206, 41, 40, 22, '#FF88AA77'); //light blue front
        drawBox(cx,    195, 38, 10, 18, '#AA55FFAA'); //ear
        // gpc.drawBox(cx,    223, 46, 10, 10, '#FFA50066'); //glasses1
        // gpc.drawBox(cx,    238, 46, 10, 10, '#FFA50066'); //glasses2
        drawBox(cx,    194, 74, 57, 12, '#FF5588CC'); //white basis
        cx.drawImage(spriteActors[1], 192, 17, 66, 66);
        drawOutline(cx, 190, 15, 70, 70, 0);
    }

}

function renderSuits(cx, w, h) {
    let s = 3;
    cx.drawImage(spriteIcons[0], w*0.325, h*0.35, 9*s, 12*s);
    cx.drawImage(spriteIcons[1], w*0.425, h*0.35, 9*s, 12*s);
    cx.drawImage(spriteIcons[2], w*0.525, h*0.35, 9*s, 12*s);
    cx.drawImage(spriteIcons[3], w*0.625, h*0.35, 9*s, 12*s);
}

// 9x12 Card Graphics
function genMiniCards(w, h) {
    cg.canvas.width = w;
    cg.canvas.height = h;
    // cg.canvas.style.width = w*10 + 'px';
    // cg.canvas.style.height = h*10 + 'px';
    cg.clearRect(0, 0, w, h);
    
    //Borders
    cg.fillStyle = '#555';
    cg.fillRect(1, 0, w-2, h);
    cg.fillRect(0, 1, w, h-2);
    
    //Card
    cg.fillStyle = '#AAA';
    cg.fillRect(1, 1, w-2, h-2);

    const saveBacking = cg.canvas.toDataURL("image/png"); 
    const imgBacking = new Image();
    imgBacking.src = saveBacking;

    //delay to give the backing time to process
    //TODO - load things properly
    //TODO - simplify card drawing
    setTimeout(() => {
        for (let i = 0; i <= 7; i++) {
            sprM[i] = new Image();    
            cg.clearRect(0, 0, w, h);
    
            cg.drawImage(imgBacking, 0, 0);
            if(i <= 3) {
                //Suit
                // 0 SPD
                // 1 HRT
                // 2 CLB
                // 3 DMD
                cg.drawImage(spriteIcons[i], 2, 3, 5, 6);
            } else if ( i == 4) { //null
                cg.fillStyle = '#333';
                cg.fillRect(2, 5, 3, 2);
                cg.fillStyle = '#F44';
                cg.fillRect(5, 5, 2, 2);
            } else if ( i == 5) { //blank
            } else if ( i == 6 || i == 7) { //back of card & deck
                let j = 0; // for deck card shift
                if(i == 7) { // deck
                    j = 1;                    
                    cg.canvas.width = w+2;
                    cg.canvas.height = h+2;
                    // cg.canvas.style.width = w*10 + 'px';
                    // cg.canvas.style.height = h*10 + 'px';
                    cg.fillStyle = '#201045'; //deck outline
                    cg.fillRect(0, 0, w+2, h+2);
                    cg.fillStyle = '#101025'; //deck side
                    cg.fillRect(0, 0, 1, h+2);
                    cg.fillRect(0, h+1, w+2, 1);
                }
                //redraw Borders over darker
                cg.fillStyle = '#444';
                cg.fillRect(1+j, 0+j, w-2, h);
                cg.fillRect(0+j, 1+j, w, h-2);
                //Card center
                cg.fillStyle = '#888'; //darker
                cg.fillRect(2+j, 1+j, w-4, h-2);
                cg.fillRect(1+j, 3+j, w-2, h-6);
                cg.fillStyle = '#333'; //darkest
                cg.fillRect(2+j, 3+j, w-4, h-6);

                cg.drawImage(spriteIcons[4], 0+j, 0+j, 9, 12);
            }
            //return base 64 image data
            let imgCard = cg.canvas.toDataURL("image/png");
            sprM[i].src = imgCard;
        }
    }, 100);
}

// 28x38 Card Graphics
function drawCard(cg, w, h) {
    cg.canvas.width = w;
    cg.canvas.height = h;
    // cg.canvas.style.width = w*4 + 'px';
    // cg.canvas.style.height = h*4 + 'px';
    //test pixel
    // cg.globalAlpha = 1; //alpha adjust
    cg.fillStyle = '#555';

    // Top 3 BORDER
    cg.fillRect(3, 0, w-6, 1);
    cg.fillRect(2, 1, w-4, 1);
    cg.fillRect(1, 2, w-2, 1);
    // Bottom 3 BORDER
    cg.fillRect(1, 35, w-2, 1);
    cg.fillRect(2, 36, w-4, 1);
    cg.fillRect(3, 37, w-6, 1);

    // Sides BORDER
    cg.fillRect(0, 3, 1, 32);
    cg.fillRect(27, 3, 1, 32);
    
    // INSIDE
    cg.fillStyle = '#AAA';
    // Top
    cg.fillRect(3, 1, w-6, 1);
    cg.fillRect(2, 2, w-4, 1);
    // Bottom
    cg.fillRect(2, 35, w-4, 1);
    cg.fillRect(3, 36, w-6, 1);
    
    //Inner segment
    cg.fillRect(1, 3, w-2, h-6);
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

function renderFont(cx, x, y, w, h, s, outputArray) {
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
            cx.drawImage(image, (x*w) + xPosition, (y*h), letterWidth, letterHeight);
            // Setup for next position
            xPosition += letterWidth + spaceBetweenLetters;
        } else if(value === -1) {
            // Add Space
            xPosition += spaceWidth;
        } else {
            // Draw letter from fntA
            const image = fntA[value];
            cx.drawImage(image, (x*w) + xPosition, (y*h), letterWidth, letterHeight);
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
    const img = new Image();
    cg.clearRect(0, 0, cg.canvas.width, cg.canvas.height);
    //console.log("Decompiling sprite data: [" + px[sNum] + "]");
    let splitData = ar[sNum].split(",");
    // Set color register
    cg.fillStyle = cREG[c];
    // console.log("splitData.length: " + splitData.length);
    // console.log("splitData: " + splitData);
    let x=0, y=0;
    //iterate over every pixel value, pixels
    for(var i=0; i < splitData.length; i++) { 
        //convert each hex element into binary
        let bRow = hexToBinary(splitData[i]);
        //bin[bin.length] = hex;
        // console.log("Sprite HEX -> Binary: " + bRow);
        for (var j = 0; j < bRow.length; j++) { //iterate over binary
            if (bRow[j]==1) { //check for pixel value
                // console.log("Drawing row[j]: " + j);
                cg.fillRect(x, y*1, 1, 1);
                // ctp.fillRect(x, y*1, 1, 1);
            }
            x += 1;
            if(x >= cg.canvas.width) { //next line
                y+=1;
                x=0;
            }
        }
    }
    // Output
    img.src = cg.canvas.toDataURL("image/png");
    out[out.length] = img;
    return img;
}

function debugArrays() {
    console.log("Finished icon sprites: " + spriteIcons.length + " generated")
    console.log("Finished actor sprites: " + spriteActors.length + " generated")
    console.log("Finished font letter sprites: " + fntA.length + " generated")
    console.log("Finished font number sprites: " + fnt0.length + " generated")
    console.log("Finished mini card sprites: " + sprM.length + " generated")
}
/////////////////////////////////////////////////////
// Sprite Data
/////////////////////////////////////////////////////
// 5x6
const p6 = [
    "23,BF,F2,38", //Spade 0
    "6,FF,F7,10", //Heart 1
    "23,BF,F7,10", //Diamond 2
    "73,BF,B2,38", //Club 3
];
// 8x10
const pA = [
    "",
    "0,0,0,0,0,0,0,0,0,FF,FE,0,1,FF,FF,0,83,DF,FF,80,C7,BF,FF,C0,E7,6F,DF,E0,F7,DF,BF,F0,F7,BF,77,F0,F7,7F,E3,F0,F7,FF,C1,F0,F7,F0,0,F0,F7,E0,0,70,F7,C0,63,20,F7,E1,D7,A0,EF,E0,0,20,D3,FE,DB,60,A1,C2,51,60,AD,80,14,60,A4,3,E5,E0,D0,0,4,20,CC,0,2,20,E4,0,C,20,F4,0,0,20,F2,1,E0,40,F9,0,0,A0,F1,80,1,70,E7,FF,FE,F8,E9,FF,E9,FC,ED,80,35,FE,EE,C0,3A,FF,EF,60,3D,7F", //Lab Man 
    "0,0,0,0,0,7F,F8,0,0,FF,FC,0,1,FF,FE,0,3,EF,DB,0,7,DF,B7,80,7,BF,6F,80,7,FF,FF,80,7,EF,EF,80,7,CF,CF,80,87,C0,1,0,CF,C0,1,0,D1,C0,1,0,D6,CF,3D,0,D6,C6,19,0,D2,C0,1,0,D0,C0,21,0,C8,80,21,0,E6,0,60,80,F2,1,0,40,FA,0,F8,40,FA,0,0,40,FA,0,0,40,F9,0,0,40,FD,0,0,40,F9,80,0,80,F3,C0,7F,20,F7,FF,FE,70,E6,7F,FF,38,EC,3F,F9,9C,EF,38,18,DE,ED,90,8,DF", //Tech Man 
    "0,11,17,44,42,A0,40,70,10,22,2E,88,80,0", //Card Back 7x10
];
// 3x4
const p4 = [
    "77,D0", //A 0
    "BA,F0", //B 1
    "72,30", //C 2
    "D6,E0", //D 3
    "F3,70", //E 4
    "F3,40", //F 5
    "72,F0", //G 6
    "BF,D0", //H 7
    "E9,70", //I 8
    "26,B0", //J 9
    "BA,D0", //K 10
    "92,70", //L 11
    "BE,D0", //M 12
    "F6,D0", //N 13
    "F6,F0", //0 14
    "F7,C0", //P 15
    "F7,90", //Q 16
    "F7,50", //R 17
    "F1,F0", //S 18
    "E9,20", //T 19
    "B6,F0", //U 20
    "B6,A0", //V 21
    "B7,D0", //W 22
    "B9,D0", //X 23
    "B5,20", //Y 24
    "EE,70", //Z 25

    "76,E0", //0 26
    "59,20", //1 27
    "E7,70", //2 28
    "EC,F0", //3 29
    "B5,90", //4 30
    "F8,F0", //5 31
    "9E,F0", //6 32
    "E5,20", //7 33
    "BE,F0", //8 34
    "F7,90", //9 35
];
/////////////////////////////////////////////////////
// Render Functions
/////////////////////////////////////////////////////


/////////////////////////////////////////////////////
// Game Setup Functions
/////////////////////////////////////////////////////

// Add required event listeners
function setupEventListeners() {
    // Event listener to track mouse movement
    cvs.addEventListener('pointermove', (e) => {
        
        getMousePos(e);

    });
    cvs.addEventListener('pointerdown', (e) => {
        getMousePos(e);
        for (let i = playerCardHand.length; i >= 0; i--) {
            if(playerCardHand[i] != null && currentHover != null) {
                var click = playerCardHand[i].checkClick(true);
                if(click) {
                    currentHeld = [playerCardHand[i], 0];
                    return;
                }
            }
        }
    });
    cvs.addEventListener('pointercancel', (e) => {
        pointerReleased()
    });
    cvs.addEventListener('pointerup', (e) => {
        pointerReleased()
    });
}

function getMousePos(e) {
    rect = cvs.getBoundingClientRect();
    // Get Mouse location
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    // Adjust for mobile setting
    if(mobile) {
        let tempX = mouseX;
        mouseX = mouseY*asp2;
        mouseY = h2 - (tempX*asp2);
    }

    
    let check = false;
    // Check if the card is hovered
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            if (playerCardHand[i].checkHover(mouseX, mouseY, width, height)) {    
                check = true;
                currentHover = playerCardHand[i];
                if(currentHeld == null) {
                    playerCardHand[i].isHov = true;
                }
            } else {
                playerCardHand[i].isHov = false;
            }
        }
    }
    if(check == false) {
        currentHover = null;
    }

}
function pointerReleased() {
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].checkClick(false);
        }
    }
    // Drop current held
    if(currentHeld != null) {
        currentHeld = null;
    }
}

// Detects values to try to determine if the device is mobile
function isMobile() {
    const isTouchDevice = navigator.maxTouchPoints > 0;
    const onTouchStart = 'ontouchstart' in window ;
    console.log("Is TouchDevice: " + isTouchDevice);
    console.log("onTouchStart: " + onTouchStart);
    let checkWin = windowCheck();
    console.log("Is SmallScreen: " + checkWin);

    return checkWin || isTouchDevice || onTouchStart;
}
function windowCheck() {
    const isSmallScreen = window.innerWidth <= 767;
    return isSmallScreen;
}

// Adjust cvs size to maximum dimensions - for mobile only
function adjustCanvasForMobile() {
    console.log("Scaling cvs for Mobile");
    // const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    cvs.style.height = window.innerWidth + 'px';
    cvs.style.width = window.innerWidth*asp + 'px';

    //reset
    rect = cvs.getBoundingClientRect();

    console.log("cvs Inner Resolution: " + cvs.width + "x" + cvs.height);
    console.log("cvs Width/Height: " + cvs.style.width + " x " + cvs.style.height);
}

/////////////////////////////////////////////////////
// Game State Management
/////////////////////////////////////////////////////

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
/////////////////////////////////////////////////////
// Card Entity Class
/////////////////////////////////////////////////////
class card {
    constructor(cdID, pos, sP, suit, rank) {
        this.cdID = cdID;
        this.pos = pos;
        this.sP = sP;
        // Assign suit/suit of card
        if(suit != null) { 
            if(suit == 1) { this.suit = 'SPD'; } 
            else if (suit == 2) { this.suit = 'HRT'; } 
            else if (suit == 3) { this.suit = 'DMD'; } 
            else if (suit == 4) { this.suit = 'CLB'; } 
            else if (suit == 0) { this.suit = 'DCK'; }}
        // Set Card Side (flopped or not)
        this.flp = false;
        if(this.cdID == 'B') { this.flp = true; }
        // Handle Special Rank(s)
        this.rank = rank;
        if(rank == 1) { this.rank = 'A';}
        // Setup images
        this.image = this.hld = new Image();
        this.setIMG();
        this.hld = sprM[5];
        // other variables
        this.isHov = this.isHld = this.isSet = false;
        //tollerence for position checks
        this.eps = 0.0001; 
        // debug card on generation
        this.printCard();
    }
    
    // Render Card
    render(cx, w, h) {
        // Toggle card image if card is held
        const img = this.isHld ? this.hld : this.image;
        if(!this.isSet) { this.checkPos(); }
        // Render card
        // Shadow first 
        if(this.isHld) {
            cx.fillStyle = '#00000033';
            cx.fillRect((w*this.pos.x)-6, (h * this.pos.y)+5, h/10, w/12);
            // cx.fillRect((w*this.pos.x)-4, (h * this.pos.y)+2, h/10, w/9);
        }
        // Flip card
        if(this.flp) {
            cx.save();
            cx.scale(1, -1);
            cx.translate(0, -cx.canvas.height);
            cx.drawImage(img, w * this.pos.x, h - this.pos.y * h - w/10, h/10, w/12);
            cx.restore();
        } else {
            if(this.suit == 'DCK') { cx.drawImage(img, w * this.pos.x - 6, h * this.pos.y - 12, h/8, w/8); }
            else if(this.isHld) { cx.drawImage(img, w * this.pos.x, h * this.pos.y, h/10, w/12); } 
            else { cx.drawImage(img, w * this.pos.x, h * this.pos.y, h/10, w/12); }
        }

        if(this.isHov) {
            cx.fillStyle = '#0000BB80';
            if(this.isHld) { cx.fillStyle = '#FFFFFF40'; }
            cx.fillRect(w*this.pos.x, h * this.pos.y, h/10, w/12);
        }
        // Render rank text 
        if(!this.flp && this.suit != 'DCK' && !this.isHld) {
            cx.font = "normal bolder 12px monospace";
            if(this.suit == 'DMD' || this.suit == 'HRT') { cx.fillStyle = '#900'; } 
            else { cx.fillStyle = '#000'; }
            cx.fillText(this.rank, (this.pos.x+0.0122)*w, (this.pos.y+0.032)*h);
        }
        cx.globalAlpha = 1.0;
    }
    checkPos() {
        let startPos = { x: this.pos.x, y: this.pos.y };
        let targetPos = { x: this.sP.x, y: this.sP.y };
        let xOk = false, yOk = false;

        if (Math.abs(startPos.x - targetPos.x) > this.eps) {
            this.pos.x = lerp(startPos.x, targetPos.x, 0.2);} 
        else { xOk = true; }
        if (Math.abs(startPos.y - targetPos.y) > this.eps) {
            this.pos.y = lerp(startPos.y, targetPos.y, 0.1); } 
        else {yOk = true; }
        // is this card settled in the target location? 
        if (xOk && yOk) { this.isSet = true;
            console.log(this.rank + " SETTLED"); }    
    }

    // Check Bounding box for isHover
    // If isHovered and held, follow mouse location
    checkHover(mX, mY, w, h) {
        let wC = h/9;
        let hC = w/9;
        // console.log("checking isHover");
        if(this.isHld) {this.pos.x = (mX/w)-(wC/w/2);
            this.pos.y = (mY/h)-(hC/h/2);}
        return (mX >= w*this.pos.x && mX <= (w*this.pos.x) + wC 
        && mY >= h*this.pos.y && mY <= (h*this.pos.y) + hC);
    }
    // Check on click event 
    checkClick(clk) {
        if(clk) {
            if(this.isHov) { this.isHld = true; return true; }} 
            else { this.isHld = false; return false; }
    }
    resetOnDrop() {
        this.isHld = this.isHov = false;
    }
    // Set Image SRC
    setIMG() {
        if(this.suit == 'SPD') { this.image = sprM[0]; } 
        else if (this.suit == 'HRT') { this.image = sprM[1]; } 
        else if (this.suit == 'DMD') { this.image = sprM[2]; } 
        else if (this.suit == 'CLB') { this.image = sprM[3]; } 
        else if (this.suit == 'DCK') { this.image = sprM[7]; } 
        //override for flipped card
        else { this.image = sprM[4]; }
        if(this.flp) { this.image = sprM[6]; }
    }
    flipCard() {
        this.flp = true;
        this.setIMG();
    }
    setsP(pos) {
        this.sP.x = pos.x;
        this.sP.y = pos.y;
    }
    setSettled(val) {
        this.isSet = val;
    }
    // Debug print card info
    printCard() {
        console.log("Gen Card: " + this.rank + " of " + this.suit + "s");
    }
    getRank() {
        if(this.rank == undefined) { return '??'; }
        return this.rank;
    }
    getSuit() {
        if(this.suit == 'BCK') { return '??'; }
        return this.suit;
    }
}
/////////////////////////////////////////////////////
// User Interface 'X' Class
// Multi class for a variety of UI objects
/////////////////////////////////////////////////////
// uix object (where x = the type)
// 0 image 
// 1 text 
// 2 button

/////////////////////////////////////////////////////
// Debug Functions
/////////////////////////////////////////////////////
function debugMouse() {
    drawBox(cx, mouseX-10, mouseY-10, 20, 20, '#0000FF50');
}
/////////////////////////////////////////////////////
// Math Functions
/////////////////////////////////////////////////////
function lerp(start, end, t) {
    return start + (end - start) * t; 
}
/////////////////////////////////////////////////////
// Random Generation Functions
/////////////////////////////////////////////////////
function toUint32(x) {
    return x >>> 0;
}
function createSeedFromString(string) {
    let seed = 0;
    for (let i = 0; i < string.length; ++i) {
        seed ^= string.charCodeAt(i) << i % 4 * 8;
    }
    return toUint32(seed);
}
function createNumberGenerator(seed) {
    return new Uint32Array([
        Math.imul(seed, 0x85ebca6b), 
        Math.imul(seed, 0xc2b2ae35),
    ]);
}
function generate(rng) {
    let s0 = rng[0];
    let s1 = rng[1] ^ s0;
    rng[0] = (s0 << 26 | s0 >> 8) ^ s1 ^ s1 << 9;
    rng[1] = s1 << 13 | s1 >> 19;
    return toUint32(Math.imul(s0, 0x9e3779bb));
}
function generateBoolean(rng, probability) {
    return generate(rng) < toUint32(probability * 0xffffffff);
}
function generateFloat(rng) {
    return generate(rng) / 0xffffffff;
}
function generateNumber(rng, min, max) {
    return min + generate(rng) % (max - min + 1);
}