/////////////////////////////////////////////////////
// Global Variables
/////////////////////////////////////////////////////
// import './style.css';

var mobile, app, cvs, cx, w, h, asp, asp2, rect, rng, seed, currentHover, currentHeld, mouseX, mouseY, currentHover, currentHeld, maxPer;
// var w2 = 720; var h2 = 540;
var w2 = 960; var h2 = 540;

var debug = true;
var webGL = true;

var deckTotal = 20;
var cardNum = 0, quaterTrack = 0, discarded = 0, dOffset = 0, lastCardCreationTime = 0, loadPer = 0;
var quater = Math.floor(deckTotal/4);
// console.log("Discards after " + quater + " cards...");

// Setup RNG - Non deterministic seed
seed = Date.now().toString(); 
rng = createNumberGenerator(
    createSeedFromString(seed)
);

// Card position slots
var cardASlots = [
    {x: .25, y: .84},
    {x: .325, y: .84},
    {x: .475, y: .84},
    {x: .625, y: .84},
    {x: .775, y: .84},
];
var cardBSlots = [
    {x: .450, y: .02},
    {x: .540, y: .02},
    {x: .630, y: .02},
    {x: .720, y: .02},
    {x: .810, y: .02},
];
const deckPos = {x: .75, y: .6};

// Card arrays for holding
var deckStack = [], cardGenQueueA = [], dscQueue = [], playerCardHand = [], opponentCardHand = [], tableCardHoldA = [], tableCardHoldB = [], titleCds = [];

// 8-Bit Color Registers
var cREG = ['#FFF', '#000', '#A33', 'A33', '0F0', '', '', '']

// In-memory canvas for graphics processing
// const mCvs = document.createElement('canvas');
// const cg = mCvs.getContext('2d');

var mCvs = document.getElementById("drawPad");
var cg = mCvs.getContext('2d');

// SPRITE DATA
var sprM = [], sprN = [], sprS = [], spriteIcons = [], spriteActors = [];
// image arrays for fontA and fontNumbers
var fnt0 = [], fntA = [];
// Game UI Buttons/Text
var uiB = [], uiT = [], uiS = [];
var bg = new Image();
var walletA;

// Main Game Process States
const MAIN_STATES = {
    LOAD: 'LOAD',
    TITLE: 'TITLE',
    OPTIONS: 'OPTIONS',
    CREDITS: 'CREDITS',
    // GAMEINTRO:  'GAMEINTRO',
    GAMEROUND: 'GAMEROUND',
    ENDROUND: 'ENDROUND',
    
    RESET:      'RESET',
    // PAUSE:      'PAUSE'
};
// Game Round Process States
const ROUND_STATES = {
    INTRO: 'INTRO',
    DEAL: 'DEAL',
    PLAY: 'PLAY',
    NEXT: 'NEXT',
    END: 'END',
    
    RESET:      'RESET',
    // PAUSE:      'PAUSE'
};

// State tracking
var stateMain = MAIN_STATES.LOAD;
var statePrev, stateRound, stateRPrev , txtBoxBtxt;
var initRound = true, initNext = true, roundStart = true, chooseA = true;
var clickPress = false, tableActive = false, handActive = false, playerWin = false, roundEnd = false, dscActive = false, txtBoxA = false, txtBoxB = false, loaded = false;

var txtBoxPos = { x:0.28, y:0.205 };
var handSize = 5;
var roundMax = 3;
var complexity = 0, chapter = 0;
var highlight = 1, highlightR = 1;
// var round = 1

// GL-Shader
var canvas3d = document.createElement('canvas');
canvas3d.height = h2;
canvas3d.width = w2;
var gl = canvas3d.getContext("webgl2");

{
    let vertices = [
        -1, -1,
        -1, 1,
        1, -1,
        1, 1,
    ];

    let vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let vertCode = `
        attribute vec2 c;
        varying vec2 u;
        void main(void) {
        u=c*0.5+0.5;
        u.y=1.0-u.y;
        gl_Position=vec4(c,0.5,1.0);
        }`;

    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    let fragCode = `
        precision highp float;
        varying vec2 u;
        uniform sampler2D t;
        void main(void) {
            vec2 a=u;
            a.x+=sin(u.x*6.28)*0.02;
            a.y+=sin(u.y*6.28)*0.02;
            vec4 c=texture2D(t,a);
            c.r=texture2D(t,a+vec2(0.002,0.0)).r;
            c.b=texture2D(t,a-vec2(0.002,0.0)).b;
            vec2 d=abs(2.0*u-1.0);
            float v=1.0-pow(d.x,25.0)-pow(d.y,25.0);
            float l=1.0-pow(d.x,4.0)-pow(d.y,4.0);
            c*=(0.5+0.6*l)*step(0.1,v)*(0.9+0.15*abs(sin(a.y*2.14*${h2}.0)));
            c.a = 0.8;
            gl_FragColor=c;
        }`;

    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}



// SFX
let // ZzFXMicro - Zuper Zmall Zound Zynth - v1.3.1 by Frank Force ~ 1000 bytes
zzfxV=.3,               // volume
zzfxX=new AudioContext, // audio context
zzfx=                   // play sound
(p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=0,B=0
,N=0)=>{let M=Math,d=2*M.PI,R=44100,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,
g=0,H=0,a=0,n=1,I=0,J=0,f=0,h=N<0?-1:1,x=d*h*N*2/R,L=M.cos(x),Z=M.sin,K=Z(x)/4,O=1+K,
X=-2*L/O,Y=(1-K)/O,P=(1+h*L)/2/O,Q=-(h+L)/O,S=P,T=0,U=0,V=0,W=0;e=R*e+9;m*=R;r*=R;t*=
R;c*=R;y*=500*d/R**3;A*=d/R;v*=d/R;z*=R;l=R*l|0;p*=zzfxV;for(h=e+m+r+t+c|0;a<h;k[a++]
=f*p)++J%(100*F|0)||(f=q?1<q?2<q?3<q?Z(g**3):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2
)%2:1-4*M.abs(M.round(g/d)-g/d):Z(g),f=(l?1-B+B*Z(d*a/l):1)*(f<0?-1:1)*M.abs(f)**D*(a
<e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/2+(c>a?0:(a<h-c?1:(
h-a)/c)*k[a-c|0]/2/p):f,N?f=W=S*T+Q*(T=U)+P*(U=f)-Y*V-X*(V=W):0),x=(b+=u+=y)*M.cos(A*
H++),g+=x+x*E*Z(a**5),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n=n||1);p=zzfxX.
createBuffer(1,h,R);p.getChannelData(0).set(k);b=zzfxX.createBufferSource();
b.buffer=p;b.connect(zzfxX.destination);b.start()}

//! ZzFXM (v2.0.3) | (C) Keith Clark | MIT | https://github.com/keithclark/ZzFXM
let zzfxM=(n,f,t,e=125)=>{let l,o,z,r,g,h,x,a,u,c,d,i,m,p,G,M=0,R=[],b=[],j=[],k=0,q=0,s=1,v={},w=zzfxR/e*60>>2;for(;s;k++)R=[s=a=d=m=0],t.map((e,d)=>{for(x=f[e][k]||[0,0,0],s|=!!f[e][k],G=m+(f[e][0].length-2-!a)*w,p=d==t.length-1,o=2,r=m;o<x.length+p;a=++o){for(g=x[o],u=o==x.length+p-1&&p||c!=(x[0]||0)|g|0,z=0;z<w&&a;z++>w-99&&u?i+=(i<1)/99:0)h=(1-i)*R[M++]/2||0,b[r]=(b[r]||0)-h*q+h,j[r]=(j[r++]||0)+h*q+h;g&&(i=g%1,q=x[1]||0,(g|=0)&&(R=v[[c=x[M=0]||0,g]]=v[[c,g]]||(l=[...n[c]],l[2]*=2**((g-12)/12),g>0?zzfxG(...l):[])))}m=G});return[b,j]}
/////////////////////////////////////////////////////
// Index Main
/////////////////////////////////////////////////////

// App Setup
window.onload = function() {
    initSetup();
    setupMusic();
}

function initSetup() {
    app = document.getElementById('app');
    cvs = document.getElementById('cvs');
    cx = cvs.getContext("2d");
    w = cvs.clientWidth;
    h = cvs.clientHeight;
    asp = w/h; // Aspect ratio of window
    asp2 = w2/h2; // Aspect ratio of inner cvs
    // pad = document.getElementById("drawPad");
    // ctp = pad.getContext("2d");
    // ctp.imageSmoothingEnabled = false;
    cx.imageSmoothingEnabled = false;

    maxPer = pA.length + p6B.length + p6R.length + p9.length + p4.length + p12.length;
    
    console.log("Game Started");
    console.log("Screen Width/Height: " + window.innerWidth + "x" + window.innerHeight);
    // console.log("cvs Inner Resolution: " + cvs.width + "x" + cvs.height);
    // console.log("Aspect Ratio: " + asp);
    // console.log("Aspect Ratio2: " + asp2);
    // Mobile check
    mobile = isMobile();
    if (mobile) {
        adjustCanvasForMobile();
        console.log("[Mobile Mode]");
    } else {
        canvas3d.style.height = h2 + 'px';
        canvas3d.style.width = w2 + 'px';
        console.log("[Browser Mode]");
    }
    
    if(webGL) {
        // rect = canvas3d.getBoundingClientRect();
        console.log("canvas3d Inner Resolution: " + canvas3d.width + "x" + canvas3d.height);
        console.log("canvas3d Width/Height: " + canvas3d.style.width + " x " + canvas3d.style.height);
    } else {
        // rect = cvs.getBoundingClientRect();
        console.log("cvs Inner Resolution: " + cvs.width + "x" + cvs.height);
        console.log("cvs Width/Height: " + cvs.style.width + " x " + cvs.style.height);
    }


    if(webGL) {
        cvs.style.display = 'none';
        app.appendChild(canvas3d);
        // canvas3d.style.width = w + 'px';
        // canvas3d.style.height = h + 'px';

        setupEventListeners(canvas3d);
        // canvas3d.width = w * 8;
        // canvas3d.height = h * 8;

        // setupShader();
    } else {
        setupEventListeners(cvs);
    }
    // Kick off Loading
    startLoad();
    
    renderTick();
}

// Primary Render Control
function renderTick(timestamp) {
    cx.clearRect(0, 0, w, h);
    // Timeout for flash
    // setTimeout(() => {
    //     cvs.style.outlineColor  = '#66c2fb';
    // }, 100);
    // State Functionality Basics
    if(stateMain != statePrev) {
        manageStateMain(); }
    if(stateRound != stateRPrev) {
        manageStateRound(); }
    if(stateMain == MAIN_STATES.LOAD) {
        loadingScreen(timestamp);
    } else if (stateMain == MAIN_STATES.TITLE) {
        renderTitle(timestamp);
    } else if (stateMain == MAIN_STATES.CREDITS) {
        renderCredits(timestamp);
    } else if (stateMain == MAIN_STATES.OPTIONS) {
        renderOptions(timestamp);
    } else if (stateMain == MAIN_STATES.GAMEROUND) {
        // renderDebug(timestamp);
        renderGame(timestamp);
    } else if (stateMain == MAIN_STATES.ENDROUND) {
        // renderEndRound(); 
    }

    if(debug) { debugMouse(); }

    if(webGL){
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cvs);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // Request next frame, ie render loop
    requestAnimationFrame(renderTick);
}
/////////////////////////////////////////////////////
// Graphical Drawing Functions
/////////////////////////////////////////////////////

//Simple canvas draw functions
function drawB(x, y, wd, ht, c) {
    cx.fillStyle = c;
    cx.fillRect(x*w, y*h, wd*w, ht*h);
}
function drawO(x, y, wd, ht, ty) {
    cx.beginPath();
    if(ty == 0) {
        cx.strokeStyle = '#444';
        cx.lineWidth = 4;
        cx.setLineDash([0, 0]);
        
    } else {
        cx.strokeStyle = '#555';
        cx.lineWidth = 5;
        // Dashed line (5px dash, 5px gap)
        cx.setLineDash([5, 5]);
    }
    cx.rect(x*w, y*h, wd*w, ht*h);
    cx.stroke();
    cx.setLineDash([]);
}

// Draws NPC Actor Art
function drawNPC(cx, i) {
    if(i == 0) {
        drawB(cx,    190, 15, 70, 70, '#888888FF'); //grey backing
        drawB(cx,    190, 32, 40, 20, '#8888FFAA'); //grey pad
        drawB(cx,    198, 18, 55, 56, '#5555FFAA'); //grey pad
        drawB(cx,    214, 42, 45, 20, '#8888FFAA'); //grey pad
        drawB(cx,    195, 48, 10, 14, '#5555FFAA'); //ear
        drawB(cx,    223, 46, 10, 10, '#FFA50066'); //glasses1
        drawB(cx,    238, 46, 10, 10, '#FFA50066'); //glasses2
        drawB(cx,    198, 75, 50, 10, '#FFFFFFAA'); //white basis
        cx.drawImage(spriteActors[4], 192, 17, 66, 66);
        drawOutline(cx, 190, 15, 70, 70, 0);
    } else if (i == 1) {
        drawB(cx,    190, 15, 70, 70, '#888888FF'); //grey backing
        drawB(cx,    190, 32, 40, 20, '#8888FF77'); //light blue back
        drawB(cx,    198, 19, 52, 56, '#AA55AAAA'); //darker blue
        drawB(cx,    206, 41, 40, 22, '#FF88AA77'); //light blue front
        drawB(cx,    195, 38, 10, 18, '#AA55FFAA'); //ear
        // gpc.drawB(cx,    223, 46, 10, 10, '#FFA50066'); //glasses1
        // gpc.drawB(cx,    238, 46, 10, 10, '#FFA50066'); //glasses2
        drawB(cx,    194, 74, 57, 12, '#FF5588CC'); //white basis
        cx.drawImage(spriteActors[1], 192, 17, 66, 66);
        drawOutline(cx, 190, 15, 70, 70, 0);
    }

}

function renderSuits() {
    let s = 3;
    cx.drawImage(spriteIcons[0], w*0.325, h*0.25, 9*s, 12*s);
    cx.drawImage(spriteIcons[2], w*0.425, h*0.25, 9*s, 12*s);
    cx.drawImage(spriteIcons[3], w*0.525, h*0.25, 9*s, 12*s);
    cx.drawImage(spriteIcons[1], w*0.625, h*0.25, 9*s, 12*s);
}

// 9x12 Card Graphics
function genMiniCards(p, s) {
    cg.clearRect(0, 0, p, s);
    //Borders
    cg.fillStyle = '#555';
    cg.fillRect(1, 0, p-2, s);
    cg.fillRect(0, 1, p, s-2);
    //Card
    cg.fillStyle = '#AAA';
    cg.fillRect(1, 1, p-2, s-2);

    const saveBacking = cg.canvas.toDataURL("image/png"); 
    const imgBacking = new Image();
    imgBacking.src = saveBacking;

    setTimeout(() => {
        for (let i = 0; i <= 7; i++) {
            sprM[i] = new Image();    
            cg.clearRect(0, 0, p, s);

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
                    cg.canvas.width = p+2;
                    cg.canvas.height = s+2;
                    // cg.canvas.style.width = p*10 + 'px';
                    // cg.canvas.style.height = s*10 + 'px';
                    cg.fillStyle = '#201045'; //deck outline
                    cg.fillRect(0, 0, p+2, s+2);
                    cg.fillStyle = '#101025'; //deck side
                    cg.fillRect(0, 0, 1, s+2);
                    cg.fillRect(0, s+1, p+2, 1);
                }
                //redraw Borders over darker
                cg.fillStyle = '#444';
                cg.fillRect(1+j, 0+j, p-2, s);
                cg.fillRect(0+j, 1+j, p, s-2);
                //Card center
                cg.fillStyle = '#888'; //darker
                cg.fillRect(2+j, 1+j, p-4, s-2);
                cg.fillRect(1+j, 3+j, p-2, s-6);
                cg.fillStyle = '#333'; //darkest
                cg.fillRect(2+j, 3+j, p-4, s-6);
                cg.drawImage(sprN[0], 0+j, 0+j, 9, 12);
            }
            //return base 64 image data
            let imgCard = cg.canvas.toDataURL("image/png");
            sprM[i].src = imgCard;
        }
    }, 200);


    setTimeout(() => {
        
        cg.globalAlpha = 0.1;
        //generate background
        // ctp.drawImage(spriteIcons[3], 2, 3, 5, 6);
        let gridSizeX = 60;
        let gridSizeY = 40;
        let gap = 2, xO=0;
        let b = false;
        cg.canvas.width = (5 * gridSizeX) + (gap * (gridSizeX - 1));
        cg.canvas.height = (6 * gridSizeY) + (gap * (gridSizeY - 1));
        for (let row = 0; row < gridSizeX; row++) {
            if(b) {
                xO = 2.5;
                b = false;
            } else {
                xO = 0;
                b = true;
            }
            for (let col = 0; col < gridSizeY; col++) {
                // Calculate the x and y position for the current sprite
                const x = (col * (5 + gap));
                const y = row * (6 + gap);
        
                // let s = generateNumber(rng, 0, 3);
                // Draw the sprite at the calculated position
                cg.drawImage(spriteIcons[0], x+xO, y, 5, 6);
            }

        }
        const saveBG = cg.canvas.toDataURL("image/png"); 
        bg.src = saveBG;
        
    }, 400);

    cg.globalAlpha = 1.0;
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
            return 26 + (Number(char));
        } else if (char == '.') {
            return 36;
        } else if (char == '!') {
            return 37;
        } else if (char == '?') {
            return 38;
        } else if (char == '-') {
            return 39;
        } else if (char == '|') {
            return 40;
        } else if (char == ':') {
            return 41;
        } else {
            //everything else, represent with -1
            return -1;
        }
    });

    return positions;
}

function renderFont(x, y, w, h, s, outputArray) {
    let letterWidth = 10*s;
    let letterHeight = 10*s;
    let spaceBetweenLetters = 4*s; 
    let spaceWidth = letterWidth;
        
    // Starting position for drawing
    let xPosition = 0;

    outputArray.forEach(value => {
        if(value >= 26) {
            // Draw number from fnt0
            const image = fntA[value];
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
function genSpriteImg(el, c, out) {

        const img = new Image();
        cg.clearRect(0, 0, cg.canvas.width, cg.canvas.height);
        //console.log("Decompiling sprite data: [" + px[sNum] + "]");
        // let splitData = ar[sNum].split(",");
        let splitData = el.split(",");
        // Set color register
        cg.fillStyle = cREG[c];
        // console.log("splitData.length: " + splitData.length);
        // console.log("splitData: " + splitData);
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
        loadPer++;
        // Output
        img.src = cg.canvas.toDataURL("image/png");
        out[out.length] = img;
        return img;
}

/////////////////////////////////////////////////////
// Sprite Data
/////////////////////////////////////////////////////
// 5x6
const p6B = [
    "23,BF,F2,38", //Spade 0
    "73,BF,B2,38", //Club 3
];
const p6R = [
    "6,FF,F7,10", //Heart 1
    "23,BF,F7,10", //Diamond 2
];
// 8x10
const pA = [
    "0,0,0,0,0,0,0,0,0,FF,FE,0,1,FF,FF,0,83,DF,FF,80,C7,BF,FF,C0,E7,6F,DF,E0,F7,DF,BF,F0,F7,BF,77,F0,F7,7F,E3,F0,F7,FF,C1,F0,F7,F0,0,F0,F7,E0,0,70,F7,C0,63,20,F7,E1,D7,A0,EF,E0,0,20,D3,FE,DB,60,A1,C2,51,60,AD,80,14,60,A4,3,E5,E0,D0,0,4,20,CC,0,2,20,E4,0,C,20,F4,0,0,20,F2,1,E0,40,F9,0,0,A0,F1,80,1,70,E7,FF,FE,F8,E9,FF,E9,FC,ED,80,35,FE,EE,C0,3A,FF,EF,60,3D,7F", //Lab Man 
    "0,0,0,0,0,7F,F8,0,0,FF,FC,0,1,FF,FE,0,3,EF,DB,0,7,DF,B7,80,7,BF,6F,80,7,FF,FF,80,7,EF,EF,80,7,CF,CF,80,87,C0,1,0,CF,C0,1,0,D1,C0,1,0,D6,CF,3D,0,D6,C6,19,0,D2,C0,1,0,D0,C0,21,0,C8,80,21,0,E6,0,60,80,F2,1,0,40,FA,0,F8,40,FA,0,0,40,FA,0,0,40,F9,0,0,40,FD,0,0,40,F9,80,0,80,F3,C0,7F,20,F7,FF,FE,70,E6,7F,FF,38,EC,3F,F9,9C,EF,38,18,DE,ED,90,8,DF", //Tech Man 
];
// 9x12
const p9 = [
    "0,11,17,44,42,A0,40,70,10,22,2E,88,80,0", //Card Back 7x10
];
const p12 = [
    "1F,83,FC,79,EF,1F,F1,FE,3F,E3,7C,67,C6,77,FE,3F,C1,F8", //AVAX 12x12
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

    "3,60", //. 36
    "48,20", //! 37
    "E4,20", //? 38
    "1C,0", //- 39
    "49,20", //| 40
    "41,0", //: 41
];
/////////////////////////////////////////////////////
// Render Functions
/////////////////////////////////////////////////////

function renderGame(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);
    // Blue background
    // cx.fillStyle = '#334';
    cx.fillStyle = '#222';
    cx.fillRect(0, 0, w2, h2);
    
    cx.globalAlpha = 0.1;
    uiS[1].render();
    cx.globalAlpha = 0.8;


    renderBacking();

    // Draw Player A Cards
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].render(cx, w, h);
        }
    }   
    
    renderButtons();
}

function renderBacking() {
    cx.globalAlpha = 1;
    // Middle grey box
    drawB(0, .20, w, .6, '#44444440');
    drawB(0, .22, w, .56, '#44444440');
    // Middle dark boxes
    drawB(.1, .24, .8, .52, '#111');
    drawB(.015, .26, .970, .48, '#111');// Edge L grey
    // Center Purple
    drawB(.115, .27, .77, .46, '#33224488');
    drawB(.115, .49, .77, .01, '#55555522'); //divider
    drawO(.115, .27, .77, .46, 1);

    // Score Array
    drawB(.8, .3, .05, .40, '#332540FF');
    drawB(.81, .34, .03, .04, '#222');
    drawB(.81, .41, .03, .04, '#222');
    drawB(.81, .475, .03, .04, '#222');
    drawB(.815, .482, .021, .025, '#733'); //marker
    drawB(.81, .54, .03, .04, '#222');
    drawB(.81, .605, .03, .04, '#222');
    
    // Hover table
    if(tableActive) {
        gpc.drawBox(ctx, 50, 250, 540, 100, '#66666677');
    }

    // DSC
    drawB(.03, .3, .1, .40, '#441530FF');
    drawB(.022, .38, .118, .24, '#CC657040');
    drawO(.03, .3, .1, .40, 1);
    cx.globalAlpha = 0.3;
    renderFont(.07, .41, w, h, 2.25, [3])
    renderFont(.07, .475, w, h, 2.25, [18])
    renderFont(.07, .54, w, h, 2.25, [2])
    cx.globalAlpha = 1;
    
    // DCK Pad
    drawB(.87, .3, .1, .40, '#232040FF');
    drawB(.862, .38, .118, .24, '#6345A050');
    drawO(.87, .3, .1, .40, 1);

    // DCK Draw
    
    // Player Hand
    if(handActive) {
        drawB(.2, .85, .6, .2, '#66666677');
    } else {
        drawB(.2, .85, .6, .2, '#111111CC');
    }
    drawO(.22, .88, .56, .2, 1);
    
    // Opponent Hand
    drawB(.5, 0, .4, .15, '#111111CC');
    drawO(.515, -0.018, .37, .15, 1);
    
    // Opponent Box
    drawB(.41, 0, .08, .15, '#111111CC');
    drawB(.417, 0.016, .065, .12, '#555');

}

function loadingScreen(timestamp) {
    let calcPer = Math.ceil((loadPer/maxPer)*100);
    
    // Initial flash effect on load
    cx.fillStyle = '#66c2fb';
    cx.fillRect(0, 0, cvs.width, cvs.height);
    cvs.style.outlineColor  = '#000000';
    
    cx.fillStyle = '#000';
    cx.font = "normal bold 24px monospace";
    
    if(calcPer >= 100) {
        cx.fillText("LOADING... 100%" , 0.05*w, 0.9*h);
        if(!loaded) {
            loaded = true;
            setTimeout(() => {
                stateMain = MAIN_STATES.TITLE;
            }, 1000);
            console.log("LOADED == TRUE");
        }
    } else {
        cx.fillText("LOADING... " + calcPer +"%" , 0.05*w, 0.9*h);
    }
}

function renderTitle(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    cx.globalAlpha = 0.5;
    drawB(0, 0, w, h, '#333333EE'); //background
    
    cx.globalAlpha = 0.1;
    uiS[1].render();
    cx.globalAlpha = 0.8;
    
    
    
    renderButtons();
    
    drawB(0.415, 0.8, 0.055, 0.1, '#CCC'); //button outer
    drawB(0.418, 0.807, 0.047, 0.085, '#F55'); //red frame
    drawB(0.426, 0.828, 0.028, 0.038, '#FDD'); //white center
    //Wallet AVAX Sprite render
    uiS[0].render();
    //Wallet info
    uiT[11].render();
    
    // Draw Player A Cards
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            titleCds[i].render();
        }
    }

    // drawB(0, 0, w, h, '#22445510'); //background
    drawB(0, 0.032, w, 0.35, '#22222288'); //title
    
    cx.globalAlpha = 0.8;
    // Title Text 
    uiT[0].render();

    cx.globalAlpha = 0.25;
    // Debug
    if(mobile) {
        uiT[10].render();
    } else {
        uiT[9].render();
    }
    
    if(highlight >= 0.05) {
        highlight -= 0.02;
    }
    cx.globalAlpha = highlight;
    drawB(0.06, 0.91, 0.5, 0.05, '#FFF');

    cx.globalAlpha = 1.0;

    renderSuits();
    // cx.font = "normal bold 22px monospace";
    // cx.fillText("TITLE", 0.45*w, 0.25*h);
    
}

function renderOptions(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    // Draw Test #1
    cx.globalAlpha = 0.8;
    drawB(0, 0, w, h, '#444455EE'); //bg
    
    cx.globalAlpha = 0.1;
    uiS[1].render();
    cx.globalAlpha = 0.8;

    uiT[2].render();

    renderButtons();
}
function renderCredits(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    // Draw Test #1
    cx.globalAlpha = 0.8;
    drawB(0, 0, w, h, '#554444EE'); //bg

    cx.globalAlpha = 0.1;
    uiS[1].render();
    cx.globalAlpha = 0.8;

    uiT[3].render();
    uiT[4].render();
    uiT[5].render();

    renderButtons();
}

function renderDebug() {
    // Blue background
    cx.fillStyle = '#448';
    cx.fillRect(w*0.125, 0, w2, h2);
    cx.fillStyle = '#AAF';
    // Test markers
    cx.fillRect(w*0.125, 0.1*h2, w2*0.01, 10);
    cx.fillRect(w*0.125, 0.2*h2, w2*0.01, 10);
    cx.fillRect(w*0.125, 0.5*h2, w2*0.01, 10);
    cx.fillRect(w*0.125, 0.8*h2, w2*0.01, 10);
    cx.fillRect(w*0.125, 0.9*h2, w2*0.01, 10);
    
    // Text
    cx.font = "normal bold 26px monospace";
    cx.fillText("JS13K", 0.16*w, 0.13*h);
    
    cx.fillStyle = '#113';
    if(mobile) {
        cx.fillText("[MOBILE]", 0.25*w, 0.13*h);
    } else {
        cx.fillText("[BROWSER]", 0.25*w, 0.13*h);
    }
    
    // Draw Player A Cards
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].render(cx, w, h);
        }
    }   
}

// Draw all buttons
function renderButtons() {
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].render();
        uiB[i].checkHover(mouseX, mouseY);
    }
    // console.log("rendering buttons: ");
}
/////////////////////////////////////////////////////
// Game Setup Functions
/////////////////////////////////////////////////////

// Add required event listeners
function setupEventListeners(c) {
    // Event listener to track mouse movement
    c.addEventListener('pointermove', (e) => {
        getMousePos(e, c);
    });
    c.addEventListener('pointerdown', (e) => {
        getMousePos(e, c);
        logicCheckCLK();

    });
    c.addEventListener('pointercancel', (e) => {
        pointerReleased()
        logicCheckUP();
    });
    c.addEventListener('pointerup', (e) => {
        pointerReleased()
        logicCheckUP();
    });
}

function getMousePos(e, c) {
    rect = c.getBoundingClientRect();
    // Get Mouse location
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    // Inversion for mobile setting
    if(mobile) {
        let tempX = mouseX;
        mouseX = mouseY*asp2;
        mouseY = h2 - (tempX*asp2);
    }    
    
    logicCheckDN();
}
function pointerReleased() {
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].checkClick(false);
        }
    }
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            titleCds[i].checkClick(false);
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
    canvas3d.style.height = window.innerWidth + 'px';
    canvas3d.style.width = window.innerWidth*asp + 'px';
    
    // canvas3d.width = w2;
    // canvas3d.height = h2;

}

// Primary Sprite Loading Process
function startLoad() {
    try {
        setTimeout(() => {
            cg.canvas.width = 32; cg.canvas.height = 32;
            genSPR(pA, 1, spriteActors)
            console.log('Black sprites generated...');
            cg.canvas.width = 5; cg.canvas.height = 6;
            genSPR(p6B, 1, spriteIcons);
            console.log('Red sprites generating...');
            cg.canvas.width = 5; cg.canvas.height = 6;
            genSPR(p6R, 2, spriteIcons);
            
            setTimeout(() => {
                console.log('Second array of sprites generating...');
                cg.canvas.width = 3; cg.canvas.height = 4;
                genSPR(p4, 0, fntA);
                console.log('Second array of sprites generating...');
                cg.canvas.width = 9; cg.canvas.height = 12;
                genSPR(p9, 1, sprN);
                console.log('Third array of sprites generating...');
                cg.canvas.width = 12; cg.canvas.height = 12;
                genSPR(p12, 2, sprS);
                console.log('Fourth array of sprites generating...');
                
                setTimeout(() => {
                    cg.canvas.width = 9; cg.canvas.height = 12;
                    genMiniCards(9, 12);
                    console.log('Mini Card sprites generating...');

                    setTimeout(() => {
                        
                        if(debug) { // Debugs sprite arrays now generated
                            debugArrays();
                        }
                        
                        setTimeout(() => {
                            playerCardHand[0] = new card('A', cardASlots[0], cardASlots[0], generateNumber(rng, 1, 4), generateNumber(rng, 0, 1), 0);
                            
                            for (let i=0; i<=5;i++) {
                                let rPos = {x: generateNumber(rng, 0.1, 0.9), y: generateNumber(rng, 1, 1.4)};
                                let rSpd = generateNumber(rng, -.2, -1.4);

                                titleCds[i] = new card('A', rPos, rPos, generateNumber(rng, 1, 4), null, rSpd, true);
                            }
                        }, 400);
            
                        setupUI();

                        // Draw canvas backing
                        cx.clearRect(0, 0, cvs.width, cvs.height);
                        cx.fillStyle = '#111';
                        cx.fillRect(0, 0, cvs.width, cvs.height);
                    
                        zzfx(...[.5,,582,.02,.02,.05,,.5,,,,,,,36,,,.81,.02]); // Load
                    }, 500);
                }, 200);
            }, 200);
        }, 200);
        
    } catch(error) {
        console.error('Error loading sprites:' + error);
    }
}
// Creates all UI objects as needed
function setupUI() {
    uiB = [
        null, // Use up slot 0 for better logic
        new uix(2, .06, .44, .15, .1, '#2AF', 'START', null), // 1
        new uix(2, .06, .6, .20, .08, '#2AF', 'OPTIONS', null), // 2
        new uix(2, .06, .7, .20, .08, '#2AF', 'CREDITS', null), // 3
        new uix(2, .05, .88, .17, .08, '#F42', 'BACK', null), // 4
        new uix(2, .81, .27, .16, .11, '#6F6', 'CONT', null), // 5
        new uix(2, .80, .735, .16, .11, '#6F6', 'NEXT', null), // 6
        new uix(2, .28, .65, .23, .06, '#2AF', 'REPLAY', null), // 7
        new uix(2, .56, .65, .15, .06, '#FA2', 'EXIT', null), // 8
        new uix(2, .06, .8, .42, .1, '#AAF', 'CONNECT WALLET', null), // 9
        new uix(2, .01, .85, .1, .1, '#888', '...', null), // 10
    ];
    uiT = [
        new uix(1, .22, .1, 3.5, 0, null, 'JS13K TITLE', null),
        new uix(1, .05, .5, 1.5, 0, null, 'DSC', null),
        new uix(1, .35, .2, 3, 0, null, 'OPTIONS', null),
        new uix(1, .35, .2, 3, 0, null, 'CREDITS', null),
        new uix(1, .23, .60, 1.5, 0, null, 'A GAME BY ALEX DELDERFILED', null),
        new uix(1, .33, .65, 1.5, 0, null, 'FOR JS13K 2O24', null),
        new uix(1, .25, .45, 2, 0, null, 'END OF ROUND', null), // 6
        new uix(1, .27, .55, 2, 0, null, 'PLAYER WINS', null), // 7
        new uix(1, .31, .55, 2, 0, null, 'GAME OVER', null), // 8
        new uix(1, .75, .32, 1.5, 0, null, '|BROWSER|', null), // 9
        new uix(1, .75, .32, 1.5, 0, null, '|MOBILE|', null), // 10
        new uix(1, .08, .92, 1, 0, null, '|DISCONNECTED|', null), // 11
    ];
    uiS = [
        // ix, x, y, dx, dy, c, str, img
        new uix(0, .423, .815, .07, .07, null, '', sprS[0], 0), // AVAX sprite
        new uix(0, -.1, -.1, 3.2, 1.6, null, '', bg, .0002), // BG sprite
        
    ];
    deckStack = [
        new card(null, {x: deckPos.x, y: deckPos.y}, {x: deckPos.x, y: deckPos.y}, 0),
        new card(null, {x: deckPos.x+0.005, y: deckPos.y-0.005}, {x: deckPos.x+0.005, y: deckPos.y-0.005}, 0),
        new card(null, {x: deckPos.x+0.010, y: deckPos.y-0.010}, {x: deckPos.x+0.010, y: deckPos.y-0.010}, 0),
        new card(null, {x: deckPos.x+0.015, y: deckPos.y-0.015}, {x: deckPos.x+0.015, y: deckPos.y-0.015}, 0)
    ];
    console.log("UI Setup Complete");
}

function genSPR(arr, col, out) {
    try {
        // Process each element in the array to generate a sprite
        arr.forEach((element, index) => {
                genSpriteImg(element, col, out);
                // loadPer++;
                // console.log(`Generated sprite for element ${index}:`, element + " now LoadPercent: " + loadPer);
        });
    } catch (error) {
        console.error('Error generating sprites:' + error);
    }
}

// Activates all buttons in actAr
// TODO do this without nesting for loops
function setButtons(actAr) {
    //disable all buttons
    for (let i = 1; i < uiB.length; i++) { 
        uiB[i].togActive(false);
    }
    // Reactivate specified
    for (let i = 1; i < uiB.length; i++) { // Check if button should be active
        for (let j = 0; j < actAr.length; j++) { // Check if button should be active
            if (actAr[j] === i) {
                uiB[i].togActive(true);
                // console.log("button activate: " + i);
            }
        }
    }
}

function setupMusic() {

}

function setupGL() {
    
    
}
/////////////////////////////////////////////////////
// Game State/Logic Management
/////////////////////////////////////////////////////

function manageStateMain() { 
    switch (stateMain) {
        case MAIN_STATES.LOAD:
            console.log('MAIN_STATES.LOAD State started ...');
            statePrev = stateMain;
            //---------------------
            setButtons([]);

            //---------------------            
            break;
        case MAIN_STATES.TITLE:
            console.log('MAIN_STATES.TITLE State started ...');
            statePrev = stateMain;
            //---------------------
            cvs.style.outlineColor  = '#000';
            setButtons([1,2,3,9]);

            //---------------------           
            break;
        case MAIN_STATES.CREDITS:
            console.log('MAIN_STATES.CREDITS State started ...');
            statePrev = stateMain;
            //---------------------
            setButtons([4]);
            
            //---------------------
            break;
        case MAIN_STATES.OPTIONS:
            console.log('MAIN_STATES.OPTIONS State started ...');
            statePrev = stateMain;
            //---------------------
            setButtons([4]);

            //---------------------
            break;
        case MAIN_STATES.GAMEROUND:
            console.log('MAIN_STATES.GAMEROUND State started ...');
            statePrev = stateMain;
            //---------------------
            setButtons([10]);

            //---------------------
            break;
        case MAIN_STATES.ENDROUND:
            console.log('MAIN_STATES.ENDROUND State started ...');
            statePrev = stateMain;
            //---------------------
            
            //---------------------
            break;
        case MAIN_STATES.RESET:
            console.log('MAIN_STATES.RESET State started ...');
            statePrev = stateMain;
            //---------------------
            
            //---------------------
            break;

        default:
            console.log('Main State:???? Process in unknown state, return to title');
            stateMain = MAIN_STATES.TITLE; // Default to title
            // statePrev = stateMain;
            break;
    }
}

function manageStateRound() { 
    switch (stateRound) {
        case ROUND_STATES.INTRO:
            console.log('ROUND_STATES.INTRO State started ...');
            stateRPrev = stateRound;
            //---------------------
            
            //---------------------
            break;
        case ROUND_STATES.DEAL:
            console.log('ROUND_STATES.DEAL State started ...');
            stateRPrev = stateRound;
            //---------------------
            
            //---------------------
            break;
        case ROUND_STATES.PLAY:
            console.log('ROUND_STATES.DEAL State started ...');
            stateRPrev = stateRound;
            //---------------------
            
            //---------------------
            break;
        case ROUND_STATES.NEXT:
            console.log('ROUND_STATES.NEXT State started ...');
            stateRPrev = stateRound;
            //---------------------
            
            //---------------------
            break;
        case ROUND_STATES.END:
            console.log('ROUND_STATES.END State started ...');
            stateRPrev = stateRound;
            //---------------------
            
            //---------------------
            break;

        case ROUND_STATES.RESET:
            console.log('ROUND_STATES.RESET State started ...');
            stateRPrev = stateRound;
            //---------------------
            
            //---------------------
            break;

        default:
            console.log('Round State:???? Process in unknown state, return to title');
            console.log('Resetting Game State');
            stateMain = MAIN_STATES.TITLE; // Default to title
            stateRound = ROUND_STATES.RESET; // Default to title
            // statePrev = stateMain;
            // stateRPrev = stateRound;
            break;
    }
}

// Triggers on mouse click
function logicCheckDN() {
    let check = false;
    if(stateMain == MAIN_STATES.GAMEROUND) {
        // Check if the card is hovered
        for (let i = 0; i < playerCardHand.length; i++) {
            if(playerCardHand[i] != null) {
                if (playerCardHand[i].checkHover(mouseX, mouseY, w, h)) {    
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
    } else if(stateMain == MAIN_STATES.TITLE) {
        for (let i = 0; i < titleCds.length; i++) {
            if(titleCds[i] != null) {
                if (titleCds[i].checkHover(mouseX, mouseY, w, h)) {    
                    check = true;
                    currentHover = titleCds[i];
                    if(currentHeld == null) {
                        titleCds[i].isHov = true;
                    }
                } else {
                    titleCds[i].isHov = false;
                }
            }
        }
    }
    if(check == false) {
        currentHover = null;
        currentHeld = null;
    }
}
function logicCheckCLK() {
    // Button checks
    for (let i = 1; i < uiB.length; i++) {
        let checkD = uiB[i].checkClick(true);
        if(checkD) {
            clickPress = i;
            console.log("Button clicked: " + i);
            zzfx(...[1.2,,9,.01,.02,.01,,2,11,,-305,.41,,.5,3.1,,,.54,.01,.11]); // click
        }
    }
    // Card Checks
    if(stateMain == MAIN_STATES.GAMEROUND) {
        for (let i = playerCardHand.length; i >= 0; i--) {
            if(playerCardHand[i] != null && currentHover != null) {
                var click = playerCardHand[i].checkClick(true);
                if(click) {
                    currentHeld = [playerCardHand[i], 0];
                    return;
                }
            }
        }
    } else if(stateMain == MAIN_STATES.TITLE) {
        for (let i = titleCds.length; i >= 0; i--) {
            if(titleCds[i] != null && currentHover != null) {
                var click = titleCds[i].checkClick(true);
                if(click) {
                    currentHeld = [titleCds[i], 0];
                    return;
                }
            }
        }
    }

}
function logicCheckUP() {
    
    if(clickPress == 1) { // START
        setButtons([]);
        stateMain = MAIN_STATES.GAMEROUND;
    } else if (clickPress == 2) { // OPTIONS
        setButtons([]);
        stateMain = MAIN_STATES.OPTIONS;
    } else if (clickPress == 3) { // CREDITS
        setButtons([]);
        stateMain = MAIN_STATES.CREDITS;
    } else if (clickPress == 4) { // BACKtoTitle
        setButtons([]);
        stateMain = MAIN_STATES.TITLE;
    } else if (clickPress == 5) { // Continue
        setButtons([]);
        if(stateRound == ROUND_STATES.INTRO) {
            stateRound = ROUND_STATES.DEAL;
            txtBoxB = false;
        } else if(stateRound == ROUND_STATES.DEAL) {
            stateRound = ROUND_STATES.PLAY;
        }
    } else if (clickPress == 6) { // Next
        setButtons([]);
        stateRound = ROUND_STATES.NEXT;
    } else if (clickPress == 7) { // Replay
        setButtons([]); // Disable all buttons
        stateRound = ROUND_STATES.RESET;
        // Start Game Sfx
        zzfx(...[0.6,0,65.40639,.11,.76,.41,1,.7,,,,,.31,,,,,.55,.05,.42]);

    } else if (clickPress == 8) { // Title
        setButtons([]);
        stateRound = ROUND_STATES.RESET;
        stateMain = MAIN_STATES.TITLE;
    } else if (clickPress == 9) { // Wallet Connect
        connectWallet();
    } else if (clickPress == 10) { // Quit
        stateRound = ROUND_STATES.RESET;
        stateMain = MAIN_STATES.TITLE;
    }

    // Reset buttons
    clickPress = false;
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].checkClick(false);
    }

}
/////////////////////////////////////////////////////
// Card Entity Class
/////////////////////////////////////////////////////
class card {
    constructor(cdID, pos, sP, suit, rank, spd, flt) {
        this.cdID = cdID, this.pos = pos, this.sP = sP, this.flt = flt;
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
        
        this.sX = h/10; // scaleX
        this.shr = true; // shrinking
        this.spd = (spd - this.pos.x)/2; // spin speed
        this.cspd = (spd - this.pos.x)/3;
        this.posi = 0; // spin speed
        this.inv = false;
    }
    
    // Render Card
    render() {
        // Toggle card image if card is held
        // const img = this.isHld ? this.hld : this.image;
        const img = this.image;
        // If not set, lerp card location
        if(!this.isSet) { this.checkPos(); }

        if(this.sX != 0) { // Spin Card
            this.sX += this.spd;
            this.posi += this.spd/2000;
            if(this.sX <= 0.3) {
                if(this.inv) {
                    this.setIMG();
                } else {
                    this.image = sprM[6];
                }
                this.inv = !this.inv;
                this.spd = -this.spd;
            } else if (this.sX > (h/10)+0.1) {
                this.spd = -this.spd;
            }
        } else { // regular card
            this.sX = h/10

            // Render rank text 
            if(!this.flp && this.suit != 'DCK' && !this.isHld) {
                cx.font = "normal bolder 12px monospace";
                if(this.suit == 'DMD' || this.suit == 'HRT') { cx.fillStyle = '#900'; } 
                else { cx.fillStyle = '#000'; }
                cx.fillText(this.rank, (this.pos.x+0.0122)*w, (this.pos.y+0.032)*h);
            }
        }
        // Render card
        // Shadow first 
        if(this.isHld) {
            cx.fillStyle = '#00000033';
            cx.fillRect((w*(this.pos.x - this.posi))-10, (h * this.pos.y)+12, this.sX, w/10);
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
            else if(this.isHld) { cx.drawImage(img, w * (this.pos.x - this.posi), h * this.pos.y, this.sX, w/11); } 
            else { cx.drawImage(img, w * (this.pos.x - this.posi), h * this.pos.y, this.sX, w/12); }
        }

        if(this.isHov) {
            cx.fillStyle = '#0000BB80';
            if(this.isHld) { cx.fillStyle = '#FFFFFF20'; }
            cx.fillRect(w*(this.pos.x - this.posi), h * this.pos.y, this.sX, w/11);
        }
        cx.globalAlpha = 1.0;

        //Float
        if(this.flt && !this.isHld) {
            this.pos.y += this.cspd/100;
            if(this.pos.y < -0.5) {
                this.pos.y = generateNumber(rng, 1, 2);
            }
        }
    }
    checkPos() {
        let strt = { x: this.pos.x, y: this.pos.y };
        let targ = { x: this.sP.x, y: this.sP.y };
        let xOk = false, yOk = false;

        if (Math.abs(strt.x - targ.x) > this.eps) {
            this.pos.x = lerp(strt.x, targ.x, 0.2);} 
        else { xOk = true; }
        if (Math.abs(strt.y - targ.y) > this.eps) {
            this.pos.y = lerp(strt.y, targ.y, 0.1); } 
        else {yOk = true; }
        // is this card settled in the target location? 
        if (xOk && yOk) { this.isSet = true;
            console.log(this.rank + " SETTLED"); }    
    }

    // Check Bounding box for isHover
    // If isHovered and held, follow mouse location
    checkHover(mX, mY) {
        let wC = h/9;
        let hC = w/9;
        // console.log("checking isHover: " + this.rank);
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
        else if (this.suit == 'HRT') { this.image = sprM[2]; } 
        else if (this.suit == 'DMD') { this.image = sprM[3]; } 
        else if (this.suit == 'CLB') { this.image = sprM[1]; } 
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
// Game State Management Object
/////////////////////////////////////////////////////

class state_game {
    constructor(gID, playerName, completed, wallet) {
        this.gID = gID, this.playerName = playerName, this.completed = completed, this.wallet = wallet;
    }
    
    // New Game
    reset() {
    }
    // Completed Percentage
    getComplete() {
    }
    // Set Players Wallet when connected
    setWallet() {
    }
}
/////////////////////////////////////////////////////
// Round State Management Object
/////////////////////////////////////////////////////

class state_round {
    constructor(rID, score, diff, char) {
        this.rID = rID, this.score = score, this.diff = diff, this.char = char;

        this.completed = false;
    }
    // Reset round
    reset() {
    }
    // Called when round is finished
    roundEnd(win) {
    }
    // Retrieve this round score
    getScore(){
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
class uix {
    constructor(ix, x, y, dx, dy, c, str, img, w) {
        this.ix = ix;   // UIX type
        this.x = x;     // x position
        this.y = y;     // y position
        this.dx = dx;     // x dimension
        this.dy = dy;     // y dimension
        this.c = c;     // color
        this.str = str; // string
        this.img = img; // image
        this.w = w; // wobble
        this.incX = w; // incrementer
        this.incY = w; // incrementer
        this.wx = 0;
        this.wy = 0;

        this.isAc = false, this.isHov = false, this.clk = false, this.pld = false;
        if(str != null) {
            this.conv = strToIndex(this.str);
            // console.log("Converted string: " + this.conv);
        } // Buttons need to be activated via call
        if(this.ix != 2) { this.isAc = true; }
    }
    render() {
        if(this.isAc) {
            if(this.ix == 0) { //image
                if(this.w!=0) { // wobble
                    // console.log("wx: " + this.wx);
                    this.wx += this.incX;
                    if(this.wx >= 0.03 || this.wx <= -0.03) {
                        this.incX = -this.incX;
                    }
                    this.wy += this.incY;
                    if(this.wy >= 0.02 || this.wy <= -0.02) {
                        this.incY = -this.incY;
                    }
                }
                cx.drawImage(this.img, (w * (this.x + this.wx)), h * (this.y + this.wy), h*this.dx, h*this.dy); }
            else if(this.ix == 1) { //text
                // cx.drawImage(img, w * this.pos.x, h * this.pos.y, h/dx, w/dy);
                renderFont(this.x, this.y, w, h, this.dx, this.conv); }
            else if(this.ix == 2) { //button
                if(this.isHov) {
                    if(this.clk) {
                        cx.globalAlpha = 0.8;
                        drawB(this.x, this.y, this.dx, this.dy, '#FFF')
                    } else {
                        cx.globalAlpha = 0.4;
                        drawB(this.x, this.y, this.dx, this.dy, '#AAA') }
                    cx.globalAlpha = 0.5;
                    drawB(this.x, this.y, this.dx, this.dy, this.c)
                } else {
                    cx.globalAlpha = 0.3;
                    drawB(this.x, this.y, this.dx, this.dy, this.c) }
                cx.globalAlpha = 1.0;
                renderFont(this.x+0.02, this.y+0.01, w, h, 1.6, this.conv);
                cx.globalAlpha = 0.8;
            } }
        cx.globalAlpha = 1.0;
    }
    checkHover(mX, mY) {
        if(this.isAc) {
            let hover = (mX >= w*this.x && mX <= (w*this.x) + w*this.dx 
            && mY >= h*this.y && mY <= (h*this.y) + h*this.dy);
                if(hover) {
                    this.isHov = true;
                    // hover SFX, toggle if played
                    if(!this.pld) {
                        this.pld = true;
                        zzfx(...[3,,194,,.04,.02,,3,-7,,-50,.39,,,,,,.51,.02,.03,930]); // button hover
                    }
                    return true;
                } else {
                    //reset
                    this.isHov = false;
                    this.pld = false;
                    this.clk = false;
                    return false; }
        } else {
            return false; }
    }
    // Check on click event 
    checkClick(clk) {
        if(clk) {
            if(this.isHov) {
                this.clk = true;
                return true; }
        } else {
            this.clk = false;
            return false; }
        // console.log("clk: " + clk);
    }
    // Toggles active state of element
    togActive(v) {
        this.isAc = v;
        // console.log("active: " + this.str);
        if(!v) {
            this.isHov = false;
            this.clk = false; 
        }
    }
    updateSTR(str) {
        this.str = str;
        this.conv = strToIndex(this.str);
    }
    updateCOL(c) {
        this.c = c;
    }
}

let provider;
let signer;
async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                console.log("Already connected:", accounts[0]);
                return accounts[0]; // Already connected, return the address
            }
            // Otherwise, request connection
            await ethereum.request({ method: 'eth_requestAccounts' });

            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            const address = await signer.getAddress();
            console.log("Wallet Connected::: " + address);
            uiT[11].updateSTR(address);
            uiB[9].updateSTR('DISCONNECT');
            uiB[9].updateCOL('#FAA');
            highlight = 1.0;
            // document.getElementById("connectWallet").innerText = `Connected: ${address}`;
            // await checkNFTs(address);
            return address;
        } catch (error) {
            console.error("Error Occured: " + error);
        }
    } else {
        alert("Please install MetaMask");
    }
}
/////////////////////////////////////////////////////
// Debug Functions
/////////////////////////////////////////////////////

function debugMouse() {
    drawB((mouseX/w)-0.01, (mouseY/h)-0.02, 0.02, 0.04, '#6666FF60');
}

function debugArrays() {
    console.log("icon sprites: " + spriteIcons.length + " generated")
    console.log("actor sprites: " + spriteActors.length + " generated")
    console.log("font letter sprites: " + fntA.length + " generated")
    // console.log("font number sprites: " + fnt0.length + " generated")
    console.log("mini card sprites: " + sprM.length + " generated")
    console.log("12x12 sprites: " + sprS.length + " generated")
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