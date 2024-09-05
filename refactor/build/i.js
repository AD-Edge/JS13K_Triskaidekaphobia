/////////////////////////////////////////////////////
// Global Variables
/////////////////////////////////////////////////////
// import './style.css';

var mobile, app, cvs, cx, w, h, asp, asp2, rect, rng, seed, currentHover, currentHeld, mouseX, mouseY, currentHover, currentHeld, maxPer, tCard, npcOp;
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
    {x: .27, y: .82},
    {x: .37, y: .82},
    {x: .47, y: .82},
    {x: .57, y: .82},
    {x: .67, y: .82},
];
var cardBSlots = [
    {x: .53, y: -.06},
    {x: .60, y: -.06},
    {x: .67, y: -.06},
    {x: .74, y: -.06},
    {x: .81, y: -.06},
];
const deckPos = {x: .882, y: .428};

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

var txtBoxPos = { x:0.43, y:0.165 };
var handSize = 5;
var roundMax = 3;
var complexity = 0, chapter = 0;
var highlight = 1, highlightR = 1, clkDel = .5;
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
        vec3 vignetteColor = vec3(0.16, 0.16, 0.34); 

        void main(void) {
            vec2 a=u;

            a.x+=sin(u.x*6.28)*0.02;
            a.y+=sin(u.y*6.28)*0.02;

            vec4 c=texture2D(t,a);

            c.r=texture2D(t,a+vec2(0.002,0.0)).r;
            c.b=texture2D(t,a-vec2(0.002,0.0)).b;

            //vignette
            vec2 d=abs(2.0*u-1.0);

            float v=1.0-pow(d.x,20.0)-pow(d.y,20.0);
            float l=1.0-pow(d.x,4.0)-pow(d.y,4.0);
            
            // vignette col
            // Blend vignette via intensity
            vec3 vignetteEffect = mix(c.rgb, vignetteColor, 1.0 - v); 

            c.rgb = (0.8 + 0.6 * l) * vignetteEffect * step(0.4, v) * (0.8 + 0.3 * abs(sin(a.y * 2.14 * ${h2}.0)));
            c.a = 0.8;
            
            // Black = transparent
            if (c.r < 0.01 && c.g < 0.01 && c.b < 0.01) {
                c.a = 0.0;
            } else {
                c.a = 0.8;
            }
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
        tickGame(timestamp);
    } else if (stateMain == MAIN_STATES.ENDROUND) {
        // renderEndRound(); 
    }

    if(debug) { debugMouse(); }

    if(webGL){
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cvs);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    if(clkDel > 0) { //slight delay for click checks
        clkDel -= 0.05;
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
        cx.setLineDash([0, 0]); } 
    else {
        cx.strokeStyle = '#555';
        cx.lineWidth = 5;
        // Dashed line (5px dash, 5px gap)
        cx.setLineDash([5, 5]); }
    cx.rect(x*w, y*h, wd*w, ht*h);
    cx.stroke();
    cx.setLineDash([]);
}

// Draws NPC Actor Art
function drawNPC(i) {
    if(i==0) {
        drawB(190, 15, 70, 70, '#888888FF'); //grey backing
        drawB(190, 32, 40, 20, '#8888FFAA'); //grey pad
        drawB(198, 18, 55, 56, '#5555FFAA'); //grey pad
        drawB(214, 42, 45, 20, '#8888FFAA'); //grey pad
        drawB(195, 48, 10, 14, '#5555FFAA'); //ear
        drawB(223, 46, 10, 10, '#FFA50066'); //glasses1
        drawB(238, 46, 10, 10, '#FFA50066'); //glasses2
        drawB(198, 75, 50, 10, '#FFFFFFAA'); //white basis
        
        cx.drawImage(spriteActors[4], 192, 17, 66, 66);
        drawO(190, 15, 70, 70, 0);
    } else if (i==1) {
        drawB(0.417, .016, 0.065, .12, '#888888FF'); //grey backing
        // drawB(190, 32, 40, 20, '#8888FF77'); //light blue back
        // drawB(198, 19, 52, 56, '#AA55AAAA'); //darker blue
        // drawB(206, 41, 40, 22, '#FF88AA77'); //light blue front
        // drawB(195, 38, 10, 18, '#AA55FFAA'); //ear
        
        // gpc.drawB(cx,    223, 46, 10, 10, '#FFA50066'); //glasses1
        // gpc.drawB(cx,    238, 46, 10, 10, '#FFA50066'); //glasses2
        
        // drawB(194, 74, 57, 12, '#FF5588CC'); //white basis
        
        uiS[3].render();
        // cx.drawImage(spriteActors[1], .417, .016, .065, .12);
        // drawOutline(190, 15, 70, 70, 0);
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
            return 26 + (Number(char));} 
        else if (char == '.') {return 36;} 
        else if (char == '!') {return 37;} 
        else if (char == '?') {return 38;} 
        else if (char == '-') {return 39;} 
        else if (char == '|') {return 40;} 
        else if (char == ':') {return 41;} 
        else if (char == '_') {return 42;} 
        else {return -1;}//everything else, represent with -1
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
// 32x32
const pA = [
    "0,0,0,0,0,0,0,0,0,FF,FE,0,1,FF,FF,0,3,DF,FF,80,7,BF,FF,C0,7,6F,DF,E0,7,DF,BF,F0,7,BF,77,F0,7,7F,E3,F0,7,FF,C1,F0,7,F0,0,F0,7,E0,0,70,7,C0,63,20,7,E1,D7,A0,F,E0,0,20,13,FE,DB,60,21,C2,51,60,2D,80,14,60,24,3,E5,E0,10,0,4,20,C,0,2,20,4,0,C,20,4,0,0,20,2,1,E0,40,1,0,0,80,1,80,1,0,7,FF,FE,0,9,FF,E8,0,D,80,34,0,E,C0,3A,0,F,60,3D,0", //Lab Man 0
    "0,0,0,0,0,0,0,0,0,FF,FE,0,1,FF,FF,0,83,DF,FF,80,C7,BF,FF,C0,E7,6F,DF,E0,F7,DF,BF,F0,F7,BF,77,F0,F7,7F,E3,F0,F7,FF,C1,F0,F7,F0,0,F0,F7,E0,0,70,F7,C0,63,20,F7,E1,D7,A0,EF,E0,0,20,D3,FE,DB,60,A1,C2,51,60,AD,80,14,60,A4,3,E5,E0,D0,0,4,20,CC,0,2,20,E4,0,C,20,F4,0,0,20,F2,1,E0,40,F9,0,0,A0,F1,80,1,70,E7,FF,FE,F8,E9,FF,E9,FC,ED,80,35,FE,EE,C0,3A,FF,EF,60,3D,7F", //Lab Man 1
    "0,0,0,0,0,7F,F8,0,0,FF,FC,0,1,FF,FE,0,3,EF,DB,0,7,DF,B7,80,7,BF,6F,80,7,FF,FF,80,7,EF,EF,80,7,CF,CF,80,87,C0,1,0,CF,C0,1,0,D1,C0,1,0,D6,CF,3D,0,D6,C6,19,0,D2,C0,1,0,D0,C0,21,0,C8,80,21,0,E6,0,60,80,F2,1,0,40,FA,0,F8,40,FA,0,0,40,FA,0,0,40,F9,0,0,40,FD,0,0,40,F9,80,0,80,F3,C0,7F,20,F7,FF,FE,70,E6,7F,FF,38,EC,3F,F9,9C,EF,38,18,DE,ED,90,8,DF", //Tech Man 
];
// 9x12
const p9 = [
    "0,11,17,44,42,A0,40,70,10,22,2E,88,80,0", //Card Back 7x10
];
// 12x12
const p12 = [
    "1F,83,FC,79,EF,1F,F1,FE,3F,E3,7C,67,C6,77,FE,3F,C1,F8", //AVAX 12x12
];
// 18x18
const p18 = [
    "0,C0,0,78,1,FF,E0,FF,FC,3F,FF,7,FF,81,FF,E0,7F,F8,1F,FE,7,FF,81,FF,E0,7F,F8,1F,FE,7,FF,81,FF,E0,3F,F0,7,F8,0,FC,0", //Badge Outline
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
    "0,E0", //_ 42
];
/////////////////////////////////////////////////////
// Render Functions
/////////////////////////////////////////////////////

function renderGame(timestamp) {

    // Blue background
    // cx.fillStyle = '#334';
    cx.fillStyle = '#222';
    cx.fillRect(0, 0, w2, h2);
    
    cx.globalAlpha = 0.1;
    uiS[1].render();
    cx.globalAlpha = 0.8;

    renderBacking();
    drawNPC(1);

    // Draw Deck stack
    for (let i = 0; i < deckStack.length; i++) {
        if(deckStack[i] != null) {
            deckStack[i].render();
        }
    }   
    // Draw Table A Cards
    for (let i = 0; i < tableCardHoldA.length; i++) {
        if(tableCardHoldA[i] != null) {
            tableCardHoldA[i].render();
        }
    }

    
    if(roundEnd) { //blackout area
        drawB(0, 0, w, h, '#00000099');
        // if(playerWin) {
        //     gpc.drawBox(ctx, 145, 255, 350, 40, '#22AA2266');
        // } else {
        //     gpc.drawBox(ctx, 145, 255, 350, 40, '#AA222266');
        // }
    }

    // Draw Player B Cards
    for (let i = 0; i < opponentCardHand.length; i++) {
        if(opponentCardHand[i] != null) {
            opponentCardHand[i].render();
        }
    }
    // Draw Player A Cards
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].render();
        }
    }   
    // Draw text boxes
    if(txtBoxB) {
        renderTextBoxB();
    }
    renderButtons();
}

// Render text box B - Opponent
function renderTextBoxB() {
    if(playerWin) {
        drawB(.42, .15, .54, .1, '#CC666688'); //grey red pad
    } else {
        drawB(.42, .15, .54, .1, '#AAAAAA88'); //grey pad
    }
    drawO(.42, .15, .54, .1, 0);

    cx.globalAlpha = .8;
    cx.font = "normal bold 22px monospace";
    cx.fillStyle = '#FFFFFF';

    txtBoxBtxt.render();
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
        drawB(.115, .5, .77, .23,'#66666677');
    }

    // DSC
    drawB(.03, .3, .1, .40, '#441530FF');
    drawB(.022, .38, .118, .24, '#CC657040');
    if(dscActive) {
        drawB(.022, .38, .118, .24,'#CC666677');
    }
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

    // x: .886, y: .428
    // DCK Shadow
    drawB(.855-dOffset, .414, .095+dOffset, .217+(dOffset/2), '#00000065');
    
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
    cx.fillStyle = '#494d7e';
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
    cx.globalAlpha = 0.5;
    drawB(0, 0, w, h, '#333333EE'); //background
    
    cx.globalAlpha = 0.1;
    uiS[1].render();
    cx.globalAlpha = 0.15;
    //Achievements
    for (let i=5; i<18; i++) {
        uiS[i].render();
    }
    cx.globalAlpha = 0.8;
    
    
    renderButtons();
    
    drawB(0.415, 0.8, 0.055, 0.1, '#CCC'); //button outer
    drawB(0.418, 0.807, 0.047, 0.085, '#F55'); //red frame
    drawB(0.426, 0.828, 0.028, 0.038, '#FDD'); //white center
    //Wallet AVAX Sprite render
    uiS[0].render();
    //Wallet info
    uiT[11].render();

    if(tCard){tCard.render();}

    // Draw title Cards
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
    drawB(.06, .91, .7, .05, '#FFF');

    cx.globalAlpha = 1.0;

    renderSuits();
    // cx.font = "normal bold 22px monospace";
    // cx.fillText("TITLE", 0.45*w, 0.25*h);
    
}

function renderOptions(timestamp) {
    cx.globalAlpha = 0.8;
    drawB(0, 0, w, h, '#444455EE'); //bg
    
    cx.globalAlpha = 0.1;
    uiS[1].render();
    cx.globalAlpha = 0.8;

    uiT[2].render();

    renderButtons();
}
function renderCredits(timestamp) {
    cx.globalAlpha = 0.8;
    drawB(0, 0, w, h, '#554444EE'); //bg

    cx.globalAlpha = 0.1;
    uiS[1].render();
    cx.globalAlpha = 0.8;

    uiT[3].render();
    uiT[4].render();
    uiT[5].render();
    uiT[12].render();
    uiT[13].render();
    uiT[14].render();
    uiT[15].render();

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
            playerCardHand[i].render();
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
        // console.log("pointermove");
        getMousePos(e, c);
        logicCheckHOV();
    });
    c.addEventListener('pointerdown', (e) => {
        // console.log("pointerdown");
        logicCheckCLK();
        
    });
    // Pointer cancel - the same as pointer up, but for mobile specific cases
    c.addEventListener('pointercancel', (e) => {
        // console.log("pointercancel");
        pointerReleased()
        logicCheckUP();
    });
    c.addEventListener('pointerup', (e) => {
        // console.log("pointerup");
        pointerReleased()
        logicCheckUP();
    });
}
// Just manage mouse position
function getMousePos(e, c) {
    rect = c.getBoundingClientRect();
    // Get Mouse location
    // mouseX = e.clientX - rect.left;
    // mouseY = e.clientY - rect.top;
    let sX = c.width / rect.width;    // Scale factor for X axis
    let sY = c.height / rect.height; 

    mouseX = (e.clientX - rect.left) / sX;
    mouseY = (e.clientY - rect.top) / sY;

    // Inversion for mobile setting
    if(mobile) {
        mouseX = (e.clientY - rect.top) / (sX/2.8);  // Y becomes X, apply scaling
        mouseY = (rect.width - (e.clientX - rect.left)) / (sY/0.9); 
        // let tempX = mouseX;
        // mouseX = mouseY*asp2;
        // mouseY = h2 - (tempX*asp2);
    }    
    
}
function pointerReleased() {
    // Reset everything
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
        zzfx(...[.3,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
        currentHeld = null;
    }
}

// Detects values to try to determine if the device is mobile
function isMobile() {
    const isTouchDevice = navigator.maxTouchPoints > 0;
    const onTouchStart = 'ontouchstart' in window ;
    console.log("Is TouchDevice: " + isTouchDevice);
    console.log("onTouchStart: " + onTouchStart);
    // let checkWin = windowCheck();
    // console.log("Is SmallScreen: " + checkWin);

    return isTouchDevice || onTouchStart;
    // return checkWin || isTouchDevice || onTouchStart;
}
// function windowCheck() {
//     const isSmallScreen = window.innerWidth <= 767;
//     return isSmallScreen;
// }

// Adjust cvs size to maximum dimensions - for mobile only
function adjustCanvasForMobile() {
    console.log("Scaling cvs for Mobile");
    // const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    cvs.style.height = window.innerWidth + 'px';
    cvs.style.width = window.innerWidth*asp + 'px';
    canvas3d.style.height = window.innerWidth + 'px';
    canvas3d.style.width = window.innerWidth*asp + 'px';
    
}

// Primary Sprite Loading Process
function startLoad() {
    try {
        setTimeout(() => {
            cg.canvas.width = 32; cg.canvas.height = 32;
            genSPR(pA, 1, spriteActors)
            console.log('spriteActors sprites generated...');
            cg.canvas.width = 5; cg.canvas.height = 6;
            genSPR(p6B, 1, spriteIcons);
            console.log('spriteIcons Black sprites generating...');
            cg.canvas.width = 5; cg.canvas.height = 6;
            genSPR(p6R, 2, spriteIcons);
            
            setTimeout(() => {
                console.log('spriteIcons Red array of sprites generating...');
                cg.canvas.width = 3; cg.canvas.height = 4;
                genSPR(p4, 0, fntA);
                console.log('fntA array of sprites generating...');
                cg.canvas.width = 9; cg.canvas.height = 12;
                genSPR(p9, 1, sprN);
                console.log('sprN array of sprites generating...');
                cg.canvas.width = 12; cg.canvas.height = 12;
                genSPR(p12, 2, sprS);
                console.log('sprS array of sprites generating...');
                
                
                setTimeout(() => {
                    cg.canvas.width = 9; cg.canvas.height = 12;
                    genMiniCards(9, 12);
                    console.log('Mini Card sprites generating...');
                    

                    setTimeout(() => {
                        cg.canvas.width = 18; cg.canvas.height = 18;
                        genSPR(p18, 1, sprS);
                        console.log('sprS array of sprites generating more...');
                        
                        setTimeout(() => {
                            
                            if(debug) { // Debugs sprite arrays now generated
                                debugArrays();
                            }
                            
                            // playerCardHand[0] = new card('A', deckPos, cardASlots[0], generateNumber(rng, 1, 4), generateNumber(rng, 1, 10), 0, 0);
                            tCard = new card('T', {x: 0.8, y: 0.45}, {x: 0.8, y: 0.45}, generateNumber(rng, 1, 4), null, -0.5, false);

                            for (let i=0; i<=6;i++) {
                                let rPos = 
                                {x: generateNumber(rng, 0, 0.75), y: generateNumber(rng, -0.4, -0.9)};
                                let rSpd = generateNumber(rng, -0.8, -1.5);

                                titleCds[i] = new card('A', rPos, rPos, generateNumber(rng, 1, 4), null, rSpd, true);
                            };

                            recalcDebugArrays();

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
        new uix(2, .04, .44, .15, .1, '#2AF', 'START', null), // 1
        new uix(2, .04, .6, .20, .08, '#2AF', 'OPTIONS', null), // 2
        new uix(2, .04, .7, .20, .08, '#2AF', 'CREDITS', null), // 3
        new uix(2, .05, .88, .17, .08, '#F42', 'BACK', null), // 4
        new uix(2, .81, .27, .16, .11, '#6F6', 'CONT', null), // 5
        new uix(2, .80, .735, .16, .11, '#6F6', 'NEXT', null), // 6
        new uix(2, .28, .65, .23, .06, '#2AF', 'REPLAY', null), // 7
        new uix(2, .56, .65, .15, .06, '#FA2', 'EXIT', null), // 8
        new uix(2, .04, .8, .42, .1, '#AAF', 'CONNECT WALLET', null), // 9
        new uix(2, .01, .94, .1, .1, '#888', '...', null), // 10
    ];
    uiT = [
        new uix(1, .22, .1, 3.5, 0, null, 'JS13K TITLE', null),
        new uix(1, .05, .5, 1.5, 0, null, 'DSC', null),
        new uix(1, .35, .2, 3, 0, null, 'OPTIONS', null),
        new uix(1, .35, .2, 3, 0, null, 'CREDITS', null),
        new uix(1, .28, .35, 1.5, 0, null, 'A GAME BY ALEX_ADEDGE', null),
        new uix(1, .35, .40, 1.5, 0, null, 'FOR JS13K 2024', null),
        new uix(1, .25, .45, 2, 0, null, 'END OF ROUND', null), // 6
        new uix(1, .27, .55, 2, 0, null, 'PLAYER WINS', null), // 7
        new uix(1, .31, .55, 2, 0, null, 'GAME OVER', null), // 8
        new uix(1, .75, .32, 1.5, 0, null, '|BROWSER|', null), // 9
        new uix(1, .75, .32, 1.5, 0, null, '|MOBILE|', null), // 10
        new uix(1, .08, .92, 1, 0, null, 'NOT CONNECTED', null), // 11
        new uix(1, .34, .54, 1.5, 0, null, 'SPECIAL THANKS:', null), //12
        new uix(1, .31, .62, 1.5, 0, null, 'FRANK FORCE - ZZFX', null), //13
        new uix(1, .28, .66, 1.5, 0, null, 'KEITH CLARK - ZZFXM', null), //14
        new uix(1, .25, .70, 1.5, 0, null, 'CSUBAGIO - SHADER SETUP', null), //15
    ];
    uiS = [
        // ix, x, y, dx, dy, c, str, img
        new uix(0, .423, .815, .07, .07, null, '', sprS[0], 0), // AVAX sprite
        new uix(0, -.1, -.1, 3.2, 1.6, null, '', bg, .0002), // BG sprite
        new uix(0, .417, .018, .116, .12, null, '', spriteActors[1], 0), // NPC0 sprite
        new uix(0, .417, .018, .116, .12, null, '', spriteActors[2], 0), // NPC1 sprite
        new uix(0, .417, .018, .116, .12, null, '', spriteActors[3], 0), // NPC2 sprite
        new uix(0, .28, .4, .15, .15, null, '', sprS[1], 0), // Badge 0
        new uix(0, .38, .4, .15, .15, null, '', sprS[1], 0), // Badge 1
        new uix(0, .48, .4, .15, .15, null, '', sprS[1], 0), // Badge 2
        new uix(0, .58, .4, .15, .15, null, '', sprS[1], 0), // Badge 3
        new uix(0, .68, .4, .15, .15, null, '', sprS[1], 0), // Badge 4
        new uix(0, .28, .56, .15, .15, null, '', sprS[1], 0), // Badge 5
        new uix(0, .38, .56, .15, .15, null, '', sprS[1], 0), // Badge 6
        new uix(0, .48, .56, .15, .15, null, '', sprS[1], 0), // Badge 7
        new uix(0, .58, .56, .15, .15, null, '', sprS[1], 0), // Badge 8
        new uix(0, .68, .56, .15, .15, null, '', sprS[1], 0), // Badge 9
        new uix(0, .48, .72, .15, .15, null, '', sprS[1], 0), // Badge 10
        new uix(0, .58, .72, .15, .15, null, '', sprS[1], 0), // Badge 11
        new uix(0, .68, .72, .15, .15, null, '', sprS[1], 0), // Badge 12
        
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


function generateCardsFromDeck(num) {
    // Main game cards (1st round)
    for(let i = 0; i < num; i++) {
        cardGenQueueA[i] = new card('A', deckPos, deckPos, generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));
    }
    if(debug) { recalcDebugArrays(); }
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
            initRound = true; //reset
            stateRound = ROUND_STATES.INTRO; //start game round
            // Start Game Sfx
            zzfx(...[0.6,0,65.40639,.11,.76,.41,1,.7,,,,,.31,,,,,.55,.05,.42]);
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
            console.log('ROUND_STATES.PLAY State started ...');
            stateRPrev = stateRound;
            //---------------------
            setTimeout(() => {
                setButtons([6,10]);
            }, 900);
            highlight = 0.8;
            // Reset card positions
            for(let i = 0; i < playerCardHand.length; i++) {
                if(playerCardHand[i] != null){
                    // console.log("updating settled #" + i + " - " + playerCardHand[i].getRank());
                    playerCardHand[i].setSettled(false);
                }
            }
            // SFX for play START
            zzfx(...[0.75,,37,.06,.01,.36,3,1.8,,,,,,.4,63,.4,,.38,.14,.12,-1600]);
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

function tickGame(timestamp) {
    if(stateRound == ROUND_STATES.INTRO) {
        if(initRound) {
            //create all cards for queue
            generateCardsFromDeck(handSize*2);
            //create opponent
            npcOp = new npc(0);
            // Get new intro text
            txtBoxBtxt = new uix(1, txtBoxPos.x, txtBoxPos.y, 1.5, 0, null, npcOp.getRandomTxt(0) , null);
            initRound = false;
        }
        
        if(roundStart) {
            setTimeout(() => {
                txtBoxB = true;
                // Speech sfx
                zzfx(...[,.3,138,,.03,.03,3,1.8,-18,,2,.04,,.1,16,,,.62,.03]);
            }, 500);
            setTimeout(() => {
                setButtons([5, 10]);
            }, 1000);
            roundStart = false;
        }
    } else if (stateRound == ROUND_STATES.DEAL) {
        setTimeout(() => {
            const delayBetweenCards = 150; // 500ms delay between cards
            // if(chooseA) {
            if(timestamp - lastCardCreationTime >= delayBetweenCards) {
                if(playerCardHand.length > opponentCardHand.length) {
                    // console.log("TIMER A");
                    cardTransferArray(chooseA);
                    chooseA = false;   
                } else {
                    // console.log("TIMER B");
                    cardTransferArray(chooseA);
                    chooseA = true;
                }
                // moveCardToArray();
                lastCardCreationTime = timestamp;
                if(debug) { recalcDebugArrays(); }
            }
        }, 300);

        // Cards are delt out, toggle to play
        if(cardGenQueueA.length == 0) {
            setTimeout(() => {
                stateRound = ROUND_STATES.PLAY;
            }, 600);
        }
        
    } else if (stateRound == ROUND_STATES.PLAY) {


    } else if (stateRound == ROUND_STATES.NEXT) {


    } else if (stateRound == ROUND_STATES.END) {


    }


    // Check Game areas
    // drawB(.115, .27, .77, .46, '#33224488');
    let hovD = checkHoverArea(.022, .38, .118, .24)
    if(hovD && currentHeld != null) {
        dscActive = true;
        tableActive = false;
        handActive = false;
    } else { // not over discard? check other locations
        dscActive = false;
        // Check table and hand hover states
        let hovT = checkHoverArea(.115, .27, 77, .46)
        if(hovT && currentHeld != null) {
            tableActive = true;
        } else {
            tableActive = false;
        }
        let hovH = checkHoverArea(.2, .85, .6, .2)
        if(hovH && currentHeld != null) {
            handActive = true;
        } else {
            handActive = false;
        }
    }

}


// Shuffle given card, in index, to final spot in array
function shuffleCardToTop(array, index) {
    // Remove card at index
    const selectedCard = array.splice(index, 1)[0];
    // Add card back to top of stack with push        
    array.push(selectedCard);

    resetSlots(array);

    if(debug) { recalcDebugArrays(); }
}

function resetSlots(array) {
    // Set slot position to final in array
    for (let i = 0; i < array.length; i++) {
        if(array[i] != null) {
            array[i].setsP(cardASlots[i]);
        }
    }
}
function removeCardFromArray(array, index) {
    array.splice(index, 1);
}

function moveCardToArray(moveTo) {
    if(currentHeld[1] == 0) {  // playerCardHand
        currentHeld[0].resetOnDrop();
        // Add to moveTo array
        moveTo.push(currentHeld[0]);
        let index = playerCardHand.indexOf(currentHeld[0])
        
        // Remove the object from playerCardHand array
        if (index !== -1) {
            playerCardHand.splice(index, 1);
        }
    } else if (currentHeld[1] == 1) { // tableCardHoldA
        currentHeld[0].resetOnDrop();
        // Add to moveTo array
        moveTo.push(currentHeld[0]);
        let index = tableCardHoldA.indexOf(currentHeld[0])
        // Remove the object from playerCardHand array
        if (index !== -1) {
            tableCardHoldA.splice(index, 1);
        }
    }
    if(debug) { recalcDebugArrays(); }
}

// Tracks when to decrement deck size
function dealCardCheck() {
    quaterTrack++;
    // Deck shrink check
    if(quaterTrack >= quater) {
        quaterTrack = 0; //reset
        dOffset -= 4; //shadow render offset
        removeCardFromArray(deckStack, deckStack.length-1);
    }
}

// Transfers cards from cardGenQUEUE to Player/Opponent
function cardTransferArray(choose) {
    if(choose) {
        if(cardGenQueueA.length > 0) {
            // Add the card to the playerCardHand
            playerCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            // Set card position in hand
            playerCardHand[playerCardHand.length-1].setsP(cardASlots[playerCardHand.length-1]);
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            // Update card stats
            cardNum++;
            deckTotal--;
            zzfx(...[.6,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
            dealCardCheck()
        }
    } else {
        if(cardGenQueueA.length > 0) {
            // Add the card to the opponentCardHand
            opponentCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            // Set card position in hand
            opponentCardHand[opponentCardHand.length-1].setsP(cardBSlots[opponentCardHand.length-1]);
            opponentCardHand[opponentCardHand.length-1].flipCard();
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            // Update card stats
            cardNum++;
            deckTotal--;
            zzfx(...[.6,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
            dealCardCheck()
        }
    }
}

function checkHoverArea(x, y, dx, dy) {
    return (mouseX >= w*x && mouseX <= (w*x) + w*dx 
    && mouseY >= h*y && mouseY <= (h*y) + h*dy);
    // return (mouseX >= width*x && mouseX <= (width*x) + dx 
    // && mouseY >= height*y && mouseY <= (height*y) + dy);
}

// ONLY check for card hovers
function logicCheckHOV() {
    // console.log("logicCheck DOWN");
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
// Mouse Click
// Only check on 
function logicCheckCLK() {
    console.log("logicCheck CLICK");
    // Button checks
    for (let i = 1; i < uiB.length; i++) {
        let checkD = uiB[i].checkClick(true);
        if(checkD) {
            clickPress = i;
            console.log("Button clicked: " + i);
        }
    }
    // Card Checks
    if(stateMain == MAIN_STATES.GAMEROUND) {
        for (let i = playerCardHand.length; i >= 0; i--) {
            if(playerCardHand[i] != null && currentHover != null) {
                var click = playerCardHand[i].checkClick(true);
                if(click) {
                    currentHeld = [playerCardHand[i], 0];

                    // Pickup quick sfx
                    zzfx(...[.2,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
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
                    // Pickup quick sfx
                    zzfx(...[.2,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
                    return;
                }
            }
        }
    }

}
// Pointer click up, basically check for buttons, 
// drop held card, and reset everything 
function logicCheckUP() { // pointer up 
    console.log("logicCheck UP");
    checkButtonClicks();

    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].checkClick(false);
        }
    }
    for (let i = 0; i < tableCardHoldA.length; i++) {
        if(tableCardHoldA[i] != null) {
            tableCardHoldA[i].checkClick(false);
        }
    }
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            titleCds[i].checkClick(false);
        }
    }

    // Drop current held
    if(currentHeld != null) {
        zzfx(...[.3,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
        
        if(stateRound == ROUND_STATES.PLAY) {
            if(tableActive) {
                moveCardToArray(tableCardHoldA)
            } else if(handActive) {
                moveCardToArray(playerCardHand)
            } else if(dscActive) {
                zzfx(...[.8,,81,,.07,.23,3,3,-5,,,,,.1,,.5,,.6,.06,,202]); // Hit Discard
                discarded++;
                moveCardToArray(dscQueue)
            }
        }
        // Reset currentHeld to nothing
        currentHeld = null;
    }
}

function checkButtonClicks() {
    if(clickPress != false && clkDel <= 0) {
        zzfx(...[1.2,,9,.01,.02,.01,,2,11,,-305,.41,,.5,3.1,,,.54,.01,.11]); // click
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
            setButtons([10]);
            if(stateRound == ROUND_STATES.INTRO) {
                stateRound = ROUND_STATES.DEAL;
                txtBoxB = false;
            } else if(stateRound == ROUND_STATES.DEAL) {
                stateRound = ROUND_STATES.PLAY;
            }
        } else if (clickPress == 6) { // Next
            setButtons([10]);
            stateRound = ROUND_STATES.NEXT;
        } else if (clickPress == 7) { // Replay
            setButtons([10]); // Disable all buttons
            stateRound = ROUND_STATES.RESET;
            // Start Game Sfx
            zzfx(...[0.6,0,65.40639,.11,.76,.41,1,.7,,,,,.31,,,,,.55,.05,.42]);
    
        } else if (clickPress == 8) { // Title
            setButtons([]);
            stateRound = ROUND_STATES.RESET;
            stateMain = MAIN_STATES.TITLE;
        } else if (clickPress == 9) { // Wallet Connect
            if(walletMM == null) {
                connectWallet();
            } else {
                disconnectWallet();
            }
        } else if (clickPress == 10) { // Quit
            stateRound = ROUND_STATES.RESET;
            stateMain = MAIN_STATES.TITLE;
        }
        
        clkDel = 0.5; //reset click delay
    }
    // Reset buttons
    clickPress = false;
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].checkClick(false);
    }
}
/////////////////////////////////////////////////////
// Text Data, NPCs, etc
/////////////////////////////////////////////////////

// Opponent 00 Intros
const o1 = [
    "lets get to it!",
    "its poker time",
    "you cant beat me!",
    "think you can beat me?",
    "the round begins...",
    "this will test you...",
];
// Opponent 00 Comments
const o2 = [
    "i can still win this",
    "you cant win this",
    "cant stop me",
    "cant stop wont stop",
    "unlucky ha",
    "im unstoppable",
    "im too good",
    "my easiest win",
    "my win your loss",
];
const o3 = [
    "victory is mine",
    "you cant win them all",
    "winning",
    "told you im best",
];
const o4 = [
    "dang it",
    "oh no oh no",
    "damn it all",
    "i will never recover",
];

/////////////////////////////////////////////////////
// Card Entity Class
/////////////////////////////////////////////////////
class card {
    constructor(cdID, pos, sP, suit, rank, spd, flt) {
        this.cdID = cdID, this.flt = flt;
        this.pos = {
            x: pos.x,
            y: pos.y
        };
        this.sP = {
            x: sP.x,
            y: sP.y
        };
        // Assign suit/suit of card
        if(suit != null) { 
            if(suit == 1) { this.suit = 'SPD'; } 
            else if (suit == 2) { this.suit = 'HRT'; } 
            else if (suit == 3) { this.suit = 'DMD'; } 
            else if (suit == 4) { this.suit = 'CLB'; } 
            else if (suit == 0) { this.suit = 'DCK'; }}
        
        this.s = 1; //scaler
            // Set Card Side (flopped or not)
        this.flp = false;
        if(this.cdID == 'B') { this.flp = true; }
        if(this.cdID == 'T') { this.s = 2.5; }
        // Handle Special Rank(s)
        this.rank = rank;
        if(rank == 1) { this.rank = 'A';}
        // Setup images
        this.image = new Image();
        this.hld = new Image();
        this.setIMG();
        this.hld = sprM[5];
        // other variables
        this.isHov = false;
        this.isHld = false;
        this.isSet = false;
        //tollerence for position checks
        this.eps = 0.0001; 
        // debug card on generation
        this.printCard();
        
        this.sX = h/10; // scaleX
        this.shr = true; // shrinking
        this.spd = (spd - this.pos.x)/1.8; // spin speed
        this.cspd = (spd - this.pos.x)/8; // move speed
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

        // if(this.sX != 0 && this.flt) { // Spin Card
        //     this.sX += this.spd;
        //     this.posi += this.spd/2000;
        //     if(this.sX <= 0.3) {
        //         if(this.inv) {
        //             this.setIMG();
        //         } else {
        //             this.image = sprM[6];
        //         }
        //         this.inv = !this.inv;
        //         this.spd = -this.spd;
        //     } else if (this.sX > (h/10)+0.1) {
        //         this.spd = -this.spd;
        //     }
        // } else { // regular card
        //     this.sX = h/10
        // }

        // Render card
        // Shadow first 
        if(this.isHld) {
            cx.fillStyle = '#00000033';
            cx.fillRect((w*(this.pos.x - this.posi))-10, (h * this.pos.y)+10, (this.sX*this.s), (w/10)*this.s);
        } else {
            cx.fillStyle = '#00000015';
            cx.fillRect((w*(this.pos.x - this.posi))-6, (h * this.pos.y)+7, (this.sX*this.s), (w/12)*this.s);
        }
        // Flip card
        if(this.flp) {
            cx.save();
            cx.scale(1, -1);
            cx.translate(0, -cx.canvas.height);
            cx.drawImage(img, w * this.pos.x, h - this.pos.y * h - w/10, (h/10)*this.s, (w/12)*this.s);
            cx.restore();
        } else {
            if(this.suit == 'DCK') { // Draw deck card
            cx.drawImage(img, w * (this.pos.x - 6), h * (this.pos.y - 12), (h/6.5)*this.s, (w/9.5)*this.s ); }
            else if(this.isHld) { // Draw held 
            cx.drawImage(img, w * (this.pos.x - this.posi), h * this.pos.y, this.sX*this.s, (w/11)*this.s ); } 
            else { // Just Draw
            cx.drawImage(img, w * (this.pos.x - this.posi), h * this.pos.y, this.sX*this.s, (w/12)*this.s ); }
        }

        if(this.isHov) { // Hover and held color
            cx.fillStyle = '#0000BB80';
            if(this.isHld) { cx.fillStyle = '#FFFFFF20'; }
            cx.fillRect(w*(this.pos.x - this.posi), h * this.pos.y, this.sX, w/12);
        }
        cx.globalAlpha = 1.0;

        //Float card movement
        if(this.flt && !this.isHld) {
            this.pos.y += this.cspd/100;
            if(this.pos.y < -0.5) {
                this.pos.y = generateNumber(rng, 1, 1.2);
                this.pos.x = generateNumber(rng, 0, 0.75);
            }
        }
        // Render rank text 
        if(this.suit != 'DCK' && this.rank != null && this.flp != true) {
            cx.font = "normal bolder 12px monospace";
            if(this.suit == 'DMD' || this.suit == 'HRT') { cx.fillStyle = '#900'; } 
            else { cx.fillStyle = '#000'; }
            cx.fillText(this.rank, (this.pos.x+0.0122)*w, (this.pos.y+0.032)*h);
        }
    }
    checkPos() {
        let strt = { x: this.pos.x, y: this.pos.y };
        let targ = { x: this.sP.x, y: this.sP.y };
        let xOk = false, yOk = false;

        if (Math.abs(strt.x - targ.x) > this.eps) {
            this.pos.x = lerp(strt.x, targ.x, 0.1);} 
        else { xOk = true; }
        if (Math.abs(strt.y - targ.y) > this.eps) {
            this.pos.y = lerp(strt.y, targ.y, 0.1); } 
        else { yOk = true; }
        // is this card settled in the target location? 
        // if (xOk && yOk) { this.isSet = true;
        //     console.log(this.rank + " SETTLED"); }
        if (xOk && yOk) {
            this.isSet = true;
            console.log(this.rank + " SETTLED: " + this.pos.x + ", " + this.pos.y);
        }        
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
        this.isHld = false, this.isHov = false;
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
        console.log("New position set: x " + pos.x + ", " + pos.y);
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
// Opponent NPC Entity Class
/////////////////////////////////////////////////////
class npc {
    constructor(id) {
        this.id = id;

    }


    //get random text from opponent
    getRandomTxt(num) {
        let str = null;
        if(num == 0) {
            let arr = o1;
            let r = generateNumber(rng, 0, arr.length-1);
            str = arr[r];
        }
        console.log("Intro retrieved: " + str);
        return str;
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

let provider, signer;
let walletMM = null;

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
            walletMM = address;
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

function disconnectWallet() {
    provider = null;
    signer = null;
    walletMM = null;
    
    console.log("Wallet Disconnected::: null");
    uiT[11].updateSTR('NOT CONNECTED');
    uiB[9].updateSTR('CONNECT WALLET');
    uiB[9].updateCOL('#AAF');
    highlight = 0.5;
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
    console.log("font fntA letter sprites: " + fntA.length + " generated")
    // console.log("font number sprites: " + fnt0.length + " generated")
    console.log("mini sprM card sprites: " + sprM.length + " generated")
    console.log("12x12 sprS sprites: " + sprS.length + " generated")
}

function genDebugArray(array, index) {
    const debugDiv = document.createElement('div');
    const title = document.createElement('h2');
    debugDiv.classList.add("debugList");
        
    if(index == 0) { // table A
        title.innerHTML = `&nbsp;DEBUG<br>[TABLE A]`;
        //remove previous
        let d0 = document.getElementById('d0');
        if (d0) { d0.remove(); }
        //update custom
        debugDiv.id = "d0";
        debugDiv.style.left = '0px';
        debugDiv.style.bottom = '80px';
    } else if(index == 1) {
        title.innerHTML = `&nbsp;DEBUG<br>[PLAYER A]`;
        //remove previous
        let d1 = document.getElementById('d1');
        if (d1) { d1.remove(); }
        //update custom
        debugDiv.id = "d1";
        debugDiv.style.top = '0px';
        debugDiv.style.left = '0px';
    } else if(index == 2) {
        title.innerHTML = `&nbsp;DEBUG<br>[OPPONENT B]`;
        //remove previous
        let d2 = document.getElementById('d2');
        if (d2) { d2.remove(); }
        //update custom
        debugDiv.id = "d2";
        debugDiv.style.top = '0px';
        debugDiv.style.right = '0px';
    } else if(index == 3) {
        title.innerHTML = `&nbsp;DEBUG<br>[GEN QUEUE]`;
        //remove previous
        let d3 = document.getElementById('d3');
        if (d3) { d3.remove(); }
        //update custom
        debugDiv.id = "d3";
        debugDiv.style.right = '0px';    
        debugDiv.style.bottom = '0px';    
    } else if(index == 4) {
        title.innerHTML = `&nbsp;DEBUG<br>[TABLE B]`;
        //remove previous
        let d4 = document.getElementById('d4');
        if (d4) { d4.remove(); }
        //update custom
        debugDiv.id = "d4";
        debugDiv.style.bottom = '80px';    
        debugDiv.style.left = '220px';    
    } else if(index == 5) {
        title.innerHTML = `&nbsp;DEBUG<br>[DISCARD]`;
        //remove previous
        let d5 = document.getElementById('d5');
        if (d5) { d5.remove(); }
        //update custom
        debugDiv.id = "d5";
        debugDiv.style.bottom = '0px';
        debugDiv.style.right = '220px';
    }
    debugDiv.appendChild(title);

    if(array.length == 0) {
        const slotE = document.createElement('p');
        slotE.textContent = `[Empty]`;
        debugDiv.appendChild(slotE);
    } else {
        array.forEach((slot, index) => {
            const slotP = document.createElement('p');
            if(slot != null) {
                // console.log(slot.getSuit());
                slotP.textContent = `Slot${index + 1}: ${slot.getRank()} of ${slot.getSuit()}s`;
            } else {
                slotP.textContent = `Slot${index + 1}: ${slot}`;
            }
            // Append the paragraph to the container div
            debugDiv.appendChild(slotP);
        });
    }
    document.body.appendChild(debugDiv);
}

function recalcDebugArrays() {
    genDebugArray(tableCardHoldA, 0);
    genDebugArray(playerCardHand, 1);
    genDebugArray(opponentCardHand, 2);
    genDebugArray(cardGenQueueA, 3);
    genDebugArray(tableCardHoldB, 4);
    genDebugArray(dscQueue, 5);
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