/////////////////////////////////////////////////////
// Global Variables
/////////////////////////////////////////////////////
// import './style.css';

var mobile, app, cvs, cx, w, h, asp, asp2, rect, rng, seed, currentHover, currentHeld, mouseX, mouseY, currentHover = null, currentHeld = null, maxPer, tCard, npcOp;
// var w2 = 720; var h2 = 540;
var w2 = 960; var h2 = 540;
var mVo = 1;
var uVo = 0;

var debug = false;
var webGL = true;

var deckTotal = 52;
var cardNum = 0, quaterTrack = 0, discarded = 0, dOffset = 0, lastCardCreationTime = 0, loadPer = 0;
var quater = Math.floor(deckTotal/4);
// console.log("Discards after " + quater + " cards...");

var game = 0;
// = intro/tutorial
// games start from 1 - 13

// Setup RNG - Non deterministic seed
seed = Date.now().toString(); 
rng = createNumberGenerator(
    createSeedFromString(seed)
);

// Card Order - Index=Points
var cardOrder = [
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    'J',
    'Q',
    'K',
    'A',
    '13',
];
// Suit Order - Index=Points
var suitOrder = [
    'CLB', //Club
    'DMD', //Diamond
    'HRT', //Heart
    'SPD', //Spade
];

// Card position slots
var cardASlots = [
    {x: .26, y: .8},
    {x: .36, y: .8},
    {x: .46, y: .8},
    {x: .56, y: .8},
    {x: .66, y: .8},
];
var cardBSlots = [
    {x: .52, y: -.07},
    {x: .59, y: -.07},
    {x: .66, y: -.07},
    {x: .73, y: -.07},
    {x: .8, y: -.07},
];

var tableASlots = [
    {x: .27, y: .55},
    {x: .37, y: .55},
    {x: .47, y: .55},
    {x: .57, y: .55},
    {x: .67, y: .55},
];
var tableBSlots = [
    {x: .27, y: .33},
    {x: .37, y: .33},
    {x: .47, y: .33},
    {x: .57, y: .33},
    {x: .67, y: .33},
];

const deckPos = {x: .882, y: .428};
const dscPos = {x: .057, y: .4};

var pStats = [];
var oStats = [];

// Card arrays for holding
var deckStack = [], cardGenQueueA = [], dscQueue = [], playerCardHand = [], opponentCardHand = [], tableCardHoldA = [], tableCardHoldB = [], titleCds = [];

// 8-Bit Color Registers
    // 0 white
    // 1 yellow
    // 2 peach
    // 3 plum
    // 4 light purple
    // 5 dark purple
    // 6 RED
    // 7 darkest purple
    // 8 BLUE
var c0 = '#fbf5ef', c1 = '#f2d3ab', c2 = '#c69fa5', c3 = '#8b6d9c', c4 = '#494d7e', c5 = '#272744', c6 = '#c44', c7 = '#1a1a38', c8 = '#22aaff';

// In-memory canvas for graphics processing
// const mCvs = document.createElement('canvas');
// const cg = mCvs.getContext('2d');

var mCvs = document.getElementById("drawPad");
var cg = mCvs.getContext('2d');

// SPRITE DATA
var sprM = [], sprN = [], sprS = [], spriteIcons = [], spriteActors = [];
// image arrays for fontA and fontNumbers
var fntW = [], fW2 = [],fB2 = [],fR2 = [], fntB = [], fntR = [];
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
    PRE: 'PRE',
    INTRO: 'INTRO',
    DEAL: 'DEAL',
    PLAY: 'PLAY',
    NEXT: 'NEXT',
    POST: 'POST',
    END: 'END',
    
    RESET:      'RESET',
    // PAUSE:      'PAUSE'
};

// State tracking
var stateMain = MAIN_STATES.LOAD;
var statePrev, stateRound, stateRPrev , txtBoxBtxt;
var initRound = true, initNext = true, roundStart = true, chooseA = true;
var clickPress = false, tableActive = false, handActive = false, deckActive = false, playerWin = false, roundEnd = false, dscActive = false, txtBoxA = false, txtBoxB = false, loaded = false;

var txtBoxPos = { x:.50, y:.1 };
var handSize = 5;
var round = 1;
var roundMax = 4;
var turn = 1;
var turnMax = 3;
var complexity = 0, chapter = 0;
var highlight = 1, highlightR = 0, clkDel = .5, bop = 4;
var tut = false;
var hovC = false;
var first = true;

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

            c.rgb = (0.8 + 0.6 * l) * vignetteEffect * step(0.4, v) * (0.8 + 0.3 * abs(sin(a.y * 2.14 * ${h2/3}.0)));
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

    maxPer = pA.length + p6B.length + p6R.length + p9.length + (p4.length*3) + p12.length + p18.length;
    
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
    // Kick off main tick
    tick();
}

// Primary Render Control
function tick(timestamp) {
    cx.clearRect(0, 0, w, h);
    // State Functionality Basics
    if(stateMain != statePrev) {
        manageStateMain(); }
    if(stateRound != stateRPrev) {
        manageStateRound(); }
    if(stateMain == MAIN_STATES.LOAD) {
        loadingScreen(timestamp);
    } else if (stateMain == MAIN_STATES.TITLE) {
        renderTitle(timestamp);
        // musicTick(timestamp);
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
    // Mouse Required
    debugMouse();

    if(webGL){
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cvs);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    if(clkDel > 0) { //slight delay for click checks
        clkDel -= 0.05;
    }
    // Request next frame, ie render loop
    requestAnimationFrame(tick);
}

/////////////////////////////////////////////////////
// Card Calculations Class
/////////////////////////////////////////////////////

// Returns an array
// [Index value of top card, Score amount of top card]
function getTopCard(arr) {
    let top = 0;
    let inx = 0;
    let score = 0;
    if(arr.length != 0) {
        for(let i = 0; i < arr.length; i++) {
            // console.log("checking slot: " + i);
            let cardRank = arr[i].getRank();
            let cardSuit = arr[i].getSuit();
            score = getCardScore(cardRank, cardSuit);
    
            if(score > top) {
                top = score; //update top scoring card
                inx = i; // index of new top scoring card
                console.log("top card found, rank: " + top);
                // console.log("top index: " + inx);
            }
        }
    }
    console.log("getTopCard return index: " + inx + 'for card rank ' + cardOrder[inx] + 'scoring: ' + score);
    return [inx, score];
}

// Returns the score of the given rank and suit card
function getCardScore(rank, suit) {
    let indexR = cardOrder.indexOf(rank);
    let indexS = suitOrder.indexOf(suit);
    if(indexS != 0) { // Suit only a small point amount
        indexS = indexS/10;
    }

    console.log("Rank: " + rank + ", Suit: " + suit);
    console.log("Rank Index: " + indexR + ", Suit: " + indexS);

    return indexR + indexS;
}

// Takes Table and Hand arrays for a given user
// Checks if there are any pairs, returns rank if there is
function lookForPair(arr1, arr2) {
    let curHand = [];
    let curTable = [];
    let pairRank = -1;
    // Check Hand 1st
    for(let i = 0; i < arr1.length; i++) {
        let arr1Rank = cardOrder.indexOf(arr1[i].getRank()); //get rank index
        for(let j = 0; j < curHand.length; j++) {
            let nextCheck = curHand[j];
            // console.log("--- pair checking card of index: " + arr1Rank + " vs " + nextCheck);
            if (arr1Rank == nextCheck) { // Pair found
                if(arr1Rank > pairRank) {
                    // console.log("--- PAIR FOUND");
                    pairRank = arr1Rank; // set new highest pair found
                }
            }
        }
        // add next rank index to checking array
        curHand[curHand.length] = arr1Rank;
    }
    return pairRank;
}

function lookForTwoPair(arr1, arr2) {
    let twoRank1 = -1;
    let twoRank2 = -1;


    return [twoRank1, twoRank2];
}

function lookForThree(arr1, arr2) {
    let threeRank = -1;


    return threeRank;
}

// Evaluate Card Arrays for current status
function calcsCards(arr1, arr2) {
    let curHand = [];
    let curTable = [];
    let curFlsh = [0,0,0,0];

    if(arr1.length != 0) {
        let cardSkip = []; // store values to skip
        //get high card
        let top1 = getTopCard(arr1);
        oHigh = opponentCardHand[top1[0]].getRank();

        //count how many of each card
        // iterate over whole given array/hand
        for(let i = 0; i < arr1.length; i++) {
            //get current card to check
            let cRinx = cardOrder.indexOf(arr1[i].getRank()); //get rank index
            let cCount = 1;
            if(!cardSkip.includes(cRinx)) { // skip if current card index already checked
                //iterate over the whole array again, checking vs our current card
                for(let j = 0; j < arr1.length; j++) {
                    if(j != i) { // skip if this is our current card
                        let nextRinx = cardOrder.indexOf(arr1[j].getRank()); //get rank index
                        // is this the same rank?
                        if(cRinx == nextRinx) {
                            cCount++;
                        }
                    }
                }
            }
            // add to skip index - to skip this rank in next checks
            cardSkip[cardSkip.length] = cRinx;
            // add next rank index to checking array
            // [rank of card, number of that rank present]
            if(cCount > 1) { // more than just the 1x card?
                curHand[curHand.length] = [cRinx, cCount];
            }

            //check flush
            if(arr1[i].getSuit() == 'SPD') {
                curFlsh[3] += 1;
            } else if(arr1[i].getSuit() == 'HRT') {
                curFlsh[2] += 1;
            } else if(arr1[i].getSuit() == 'DMD') {
                curFlsh[1] += 1;
            } else if(arr1[i].getSuit() == 'CLB') {
                curFlsh[0] += 1;
            }
        }
        oDups = curHand; // save to proper variable
        oFlsh = curFlsh;
        // two pair?
        if(oDups.length > 1) {
            oTwoP = true;
        }

        //count number of each suit (flush)


        //count max chain (straight)

    }
}


// Returns winning comparison result between two arrays of cards
// -1=Player LOSS, 0=TIE, 1=Player WIN
function findWinner(array1, array2) {
    let a1Top = 0;
    let a1Score = 0;
    let a2Top = 0;
    let a2Score = 0;
    let draw = false;
    // Iterate over array 1, find smallest card
    if(array1.length > 0) {
        // console.log("---------array 1 size: " + array1.length);
        let a1TopCard = getTopCard(array1);
        a1Top = array1[a1TopCard[0]].getRank();
        a1Score = a1TopCard[1];
    }
    // Iterate over array 2, find smallest card
    if(array2.length > 0) {
        // console.log("---------array 2 size: " + array2.length);
        let a2TopCard = getTopCard(array2);
        a2Top = array2[a2TopCard[0]].getRank();
        a2Score = a2TopCard[1];
    }
    console.log("---------array 1 top card: " + a1Top);
    console.log("---------array 1 score: " + a1Score*10);
    console.log("---------array 2 top card: " + a2Top);
    console.log("---------array 2 score: " + a2Score*10);
    if(a1Score == a2Score) {
        draw = true;
    }

    if(!draw) {
        if(a1Score > a2Score) {
            console.log("PLAYER WINS");
            zzfx(...[1.0,,243,.03,.01,.14,1,.2,5,,147,.05,,,,,.02,.66,.04,,-1404]); // Win
            return 1;
        } else {
            console.log("OPPONENT WINS");
            zzfx(...[1.9,.01,204,.02,.21,.26,2,2.3,,,,,,.1,,.4,.03,.87,.1]); // B Loss
            return -1;            
        }
    } else {
        console.log("THIS ROUND WAS A TIE");
        return 0;
    }
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
        cx.strokeStyle = '#212';
        cx.lineWidth = 4;
        cx.setLineDash([0, 0]); } 
    else {
        cx.strokeStyle = c4;
        cx.lineWidth = 5;
        // Dashed line (5px dash, 5px gap)
        cx.setLineDash([5, 5]); }
    cx.rect(x*w, y*h, wd*w, ht*h);
    cx.stroke();
    cx.setLineDash([]);
}

// Draws NPC Actor Art
function drawNPC(i, x, y) {
    if(i==0) {
        drawB(190, 15, 70, 70, '#001'); //grey backing
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
        drawB(x, y, 0.065, .13, c2); //grey backing
        // drawB(190, 32, 40, 20, '#8888FF77'); //light blue back
        // drawB(198, 19, 52, 56, '#AA55AAAA'); //darker blue
        // drawB(206, 41, 40, 22, '#FF88AA77'); //light blue front
        // drawB(195, 38, 10, 18, '#AA55FFAA'); //ear
        
        // gpc.drawB(cx,    223, 46, 10, 10, '#FFA50066'); //glasses1
        // gpc.drawB(cx,    238, 46, 10, 10, '#FFA50066'); //glasses2
        
        // drawB(194, 74, 57, 12, '#FF5588CC'); //white basis
        
        uiS[3].updatePOS(x, y);
        uiS[3].render();
        // cx.drawImage(spriteActors[1], .417, .016, .065, .12);
        // drawOutline(190, 15, 70, 70, 0);
    }

}

function renderSuits(x,y, n) {
    let s = 4;
    cx.drawImage(spriteIcons[n], w*x, h*y, 9*s, 12*s);
}

// 9x12 Card Graphics
function genMiniCards(p, s) {
    
    cx.globalAlpha = 0.8;
    cg.clearRect(0, 0, p, s);
    //Borders
    cg.fillStyle = c7;
    cg.fillRect(1, 0, p-2, s);
    cg.fillRect(0, 1, p, s-2);
    //Card
    cg.fillStyle = c2; // change this for negative? 
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
                cg.fillStyle = c7;
                cg.fillRect(2, 5, 3, 2);
                cg.fillStyle = c6;
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
                    cg.fillStyle = '#112'; //deck outline
                    cg.fillRect(0, 0, p+2, s+2);
                    cg.fillStyle = '#001'; //deck side
                    cg.fillRect(0, 0, 1, s+2);
                    cg.fillRect(0, s+1, p+2, 1);
                    //redraw Borders over darker
                    // cg.fillStyle = '#444';
                    cg.fillStyle = c4;
                    cg.fillRect(1+j, 0+j, p-2, s);
                    cg.fillRect(0+j, 1+j, p, s-2);
                    cg.fillStyle = c5; //darker
                } else {
                    cg.fillStyle = c7;
                    //redraw Borders over darker
                    // cg.fillStyle = '#444';
                    cg.fillRect(1+j, 0+j, p-2, s);
                    cg.fillRect(0+j, 1+j, p, s-2);
                    cg.fillStyle = c4; //darker
                }
                //Card center
                cg.fillRect(2+j, 1+j, p-4, s-2);
                cg.fillRect(1+j, 3+j, p-2, s-6);
                // cg.fillStyle = '#333'; //darkest
                cg.fillStyle = c7; //darkest
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

// Convert a string to numbered indexes
function strToIndex(str) {
    str = (str.toString()).toLowerCase();
    let positions = Array.from(str).map(char => {
        //handle characters
        if (char >= 'a' && char <= 'z') {
            //overrides for specials
            if (char == 'm') {return -450;}
            if (char == 'q') {return -460;}
            if (char == 'w') {return -470;}
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
        else if (char == '(') {return 43;} 
        else if (char == ')') {return 44;} 
        else {return -1;}//everything else, represent with -1
         
    });

    return positions;
}

function renderFont(x, y, w, h, s, fntA, outputArray) {
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
            let image = null;
            if(value < -10) { //special overrides
                let v = (value/10)*-1;
                image = fntA[v];
            } else {
                // Draw letter from fntA
                image = fntA[value];
            }
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
        cg.fillStyle = c;
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
// 5x4
const p5 = [
    "F5,6B,50", //M 43 0
    "E4,AC,F0", //Q 44 0
    "8D,6A,F0", //W 45 0
];
// 3x4
const p4 = [
    "77,D0", //A 0
    "DE,F0", //B 1 BA,F0
    "72,30", //C 2
    "D6,E0", //D 3
    "F3,70", //E 4
    "F3,40", //F 5
    "72,F0", //G 6
    "BE,D0", //H 7
    "E9,70", //I 8
    "26,B0", //J 9
    "BA,D0", //K 10
    "92,70", //L 11
    "BE,D0", //M 12
    "D6,D0", //N 13
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
    "FE,F0", //8 34 BE,F0
    "FC,90", //9 35 F7,90

    "3,60", //. 36
    "48,20",//! 37
    "E4,20",//? 38
    "1C,0", //- 39
    "49,20",//| 40
    "41,0", //: 41
    "0,E0", //_ 42
    "52,20",//( 43
    "44,A0",//) 44

];
/////////////////////////////////////////////////////
// Render Functions
/////////////////////////////////////////////////////

function renderGame(timestamp) {

    // Blue background
    // cx.fillStyle = '#334';
    cx.fillStyle = c7;
    cx.fillRect(0, 0, w2, h2);

    if (stateRound != ROUND_STATES.POST && stateRound != ROUND_STATES.PRE) {
        renderGameMain();

    } else if (stateRound == ROUND_STATES.PRE) {
        cx.fillStyle = '#111';
        cx.fillRect(0, 0, w2, h2);
        renderGamePRE();
    } else if (stateRound == ROUND_STATES.POST) {
        cx.fillStyle = '#222';
        cx.fillRect(0, 0, w2, h2);
        renderGamePOST();
    }

    if(!tut) {
        renderButtons();
    }
}

function renderGameMain() {
    cx.globalAlpha = 1;
    uiS[1].render();
    cx.globalAlpha = 0.8;
    
    renderBacking();
    drawNPC(1, 0.407, .016);
    
    // cx.globalAlpha = 1.0;
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
    // Draw Table B Cards
    for (let i = 0; i < tableCardHoldB.length; i++) {
        if(tableCardHoldB[i] != null) {
            tableCardHoldB[i].render();
        }
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
    
    // Render end of round
    cx.globalAlpha = 1;
    if(roundEnd) { //blackout area
        drawB(0, 0, w, h, '#000000CF');
        if(playerWin == 1) { // WIN
            drawB(.33, .51, 0.33, 0.07, c4);
            uiT[7].render(); // LOSS
        } else if (playerWin == -1) {
            drawB(.35, .51, 0.27, 0.07, c6);
            uiT[8].render();
        } else if (playerWin == 0) { // DRAW
            drawB(.35, .51, 0.27, 0.07, c7);
            uiT[19].render();

        }
        uiT[6].render();    
    }
    // Draw text boxes
    if(txtBoxB) {
        renderTextBoxB();
    }
}
function renderGamePRE() {
    if(game == 0) {
        uiT[31].render(); // OBJECTIVE
        uiT[32].render(); // WIN POKER
        uiT[33].render(); // Viable Hands
        uiT[34].render();

        
        uiT[44].render(); // Opponent
        uiT[45].render(); 
        uiT[46].render(); 
        uiT[47].render(); 
        uiT[69].render(); // round needed

        drawNPC(1, .65, .65);
        
        cx.globalAlpha = 0.2;
        uiT[35].render();
        uiT[36].render();
        uiT[37].render();
        uiT[38].render();
        uiT[39].render();
        uiT[40].render();
        uiT[41].render();
        uiT[42].render(); 
        uiT[43].render(); 
        
    }
}
function renderGamePOST() {
    if(round < roundMax) { // WON / LOST / CONTINUE
        if(game == 0) {
            uiT[48].render(); // ROUND END
            // uiT[49].render(); // UPGRADE - CONTINUE
            
            uiT[60].render(); // Round stats
            uiT[61].render(); // 
            uiT[62].render(); // 
            uiT[63].render(); // 
            uiT[64].render(); // 
            uiT[65].render(); // 
            
        }
    } else { // GAME OVER
        uiT[50].render(); // 

    }
}

let yI = -0.0004;
let yW = 0;
// Render text box B - Opponent
function renderTextBoxB() {

    yW += yI;
    if(yW >= 0.01) {
        yI = -0.0004;
    } else if (yW < -0.01) {
        yI = 0.0004;
    }
    
    cx.globalAlpha = .4;
    drawB(.485, .065+yW, .495, .13, c6); //outer highlight
    cx.globalAlpha = 1;
    if(playerWin == 1) {
        drawB(.49, .08+yW, .48, .1, '#944'); //grey red pad
    } else {
        drawB(.49, .08+yW, .48, .1, c4); //grey pad
    }
    drawO(.49, .08+yW, .48, .1, 0);

    cx.globalAlpha = .8;
    cx.font = "normal bold 22px monospace";
    cx.fillStyle = '#FFFFFF';

    txtBoxBtxt.y = txtBoxPos.y+yW;
    txtBoxBtxt.render();
}

function renderBacking() {
    cx.globalAlpha = 1;
    // Middle grey box
    cx.globalAlpha = .2;
    drawB(0, .18, w, .64, c4);
    cx.globalAlpha = .5;
    drawB(0, .22, w, .56, c3);
    cx.globalAlpha = 1;
    // Middle dark boxes
    drawB(.1, .24, .8, .52, '#001');
    drawB(.015, .26, .970, .48, '#001');// Edge L grey
    // Center Purple
    drawB(.115, .27, .77, .46, c5);
    drawB(.115, .49, .77, .01, c7); //divider
    drawO(.115, .27, .77, .46, 1);

    // Score Array
    drawB(.8, .3, .05, .40, c7);
    drawB(.81, .34, .03, .04, '#112');
    drawB(.81, .41, .03, .04, '#112');
    drawB(.81, .475, .03, .04, '#112');
    drawB(.815, .482, .021, .025, c6); //marker
    drawB(.81, .54, .03, .04, '#112');
    drawB(.81, .605, .03, .04, '#112');
    
    // Hover table
    if(tableActive) {
        drawB(.115, .5, .77, .23,'#66666677');
    }

    // DSC
    drawB(.03, .3, .1, .40, c7);
    cx.globalAlpha = .2;
    drawB(.022, .38, .118, .24, c6);
    if(dscActive) {
        cx.globalAlpha = .35;
        drawB(.022, .38, .118, .24, c6);
    }
    cx.globalAlpha = .8;
    drawO(.03, .3, .1, .40, 1);
    cx.globalAlpha = .3;
    renderFont(.07, .41, w, h, 2.25, fntW, [3])
    renderFont(.07, .475, w, h, 2.25, fntW, [18])
    renderFont(.07, .54, w, h, 2.25, fntW, [2])
    cx.globalAlpha = 1;
    
    // Game STATS
    uiT[18].render();
    uiT[70].render();
    uiT[71].render();
    uiT[72].render();
    uiT[73].render();

    // DCK Pad
    drawB(.87, .3, .1, .40, c7);
    drawB(.862, .38, .118, .24, '#6345A050');
    if(deckActive && !currentHeld) {
        drawB(.862, .38, .118, .24, '#7755CCDD');
    }
    drawO(.87, .3, .1, .40, 1);

    // x: .886, y: .428
    // DCK Shadow
    drawB(.855-dOffset, .414, .095+dOffset, .217+(dOffset*1.2), '#00000065');
    
    // Player Hand
    if(handActive) {
        drawB(.2, .85, .6, .2, '#66666677');
    } else {
        drawB(.2, .85, .6, .2, c3);
    }
    drawO(.22, .88, .56, .2, 1);
    
    // Opponent Hand
    drawB(.5, 0, .4, .15, c3);
    drawO(.515, -0.018, .37, .15, 1);
    
    // Opponent Box
    drawB(.40, 0, .08, .16, '#001');
    drawB(.407, 0.016, .065, .13, c1);

    // Player Hand Highlight
    if(highlight >= 0.025) {
        highlight -= 0.025;
        cx.globalAlpha = highlight;
        drawB(.2, .85, .6, .2, '#33AAEE');
        cx.globalAlpha = 1.0;
    }
    
    // Round & Round Number Highlight
    cx.globalAlpha = 0.13;
    uiT[16].render();
    if(highlightR >= 0.05) {
        highlightR -= 0.05;
        cx.globalAlpha = highlightR;
    } else {
        cx.globalAlpha = 0.13;
    }
    uiT[17].render();

    cx.globalAlpha = 1;
    
    if(stateRound == ROUND_STATES.PLAY) {// Tutorial helper
        if(first) { 
            uiT[66].render();
        }
    }
    if(tut) {
        first = false; // end tutorial message
        drawB(0, .14, w, .73, '#000000DD'); //tutorial backing
        drawB(.022, .38, .118, .24, '#99555580'); // discard
        drawB(.862, .38, .118, .24, '#7755CC88'); // Deck
        uiT[51].render();
        uiT[52].render();
        uiT[53].render();
        uiT[54].render();
        uiT[55].render();
        uiT[56].render();
        uiT[57].render();
        uiT[58].render();
        uiT[59].render();
        uiT[67].render();
        uiT[68].render();
        
        renderSuits(.62, .5, 1);
        renderSuits(.67, .5, 3);
        renderSuits(.72, .5, 2);
        renderSuits(.77, .5, 0);
        if(deckActive) {
            drawB(.862, .38, .118, .24, '#111111BB'); // deck hover
        }


    }
 }

function loadingScreen(timestamp) {
    let calcPer = Math.ceil((loadPer/maxPer)*100);
    
    // Initial flash effect on load
    cx.fillStyle = c4;
    cx.fillRect(0, 0, cvs.width, cvs.height);
    
    cx.globalAlpha = 0.7;
    cx.fillStyle = c0;
    cx.font = "normal bold 32px monospace";
    
    if(calcPer >= 100) {
        cx.fillText("LOADING... 100%" , 0.07*w, 0.9*h);
        if(!loaded) {
            loaded = true;
            setTimeout(() => {
                stateMain = MAIN_STATES.TITLE;
            }, 1000);
            console.log("LOADED == TRUE");
        }
    } else {
        cx.fillText("LOADING... " + calcPer +"%" , 0.07*w, 0.9*h);
    }
    
    cx.globalAlpha = 1;
}

function renderTitle(timestamp) {
    cx.globalAlpha = 1;
    // drawB(0, 0, w, h, '#558'); //background
    drawB(0, 0, w, h, '#4F4F7F'); //background
    // drawB(0, 0, w, h, c4); //background
    
    cx.globalAlpha = 0.15;
    uiS[1].render();
    cx.globalAlpha = 0.4;
    //Achievements
    for (let i=5; i<9; i++) {
        uiS[i].render();
    }
    cx.globalAlpha = 0.8;
    
    if(tCard) {
        tCard.render();
    }

    renderButtons();
    
    // AVAX Button
    drawB(0.415, 0.78, 0.055, 0.1, '#CCC'); //button outer
    drawB(0.418, 0.787, 0.047, 0.085, '#F55'); //red frame
    drawB(0.426, 0.808, 0.028, 0.038, '#FDD'); //white center
    // Wallet AVAX Sprite render
    uiS[0].render();

    // Draw title Cards
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            titleCds[i].render();
        }
    }
    // drawB(0, 0.07, w, 0.30, '#27274477'); //title
    cx.globalAlpha = .6;
    drawB(0, 0, w, .36, c5); // title banner
    drawB(0, .91, w, .1, c5); // base banner
    
    // Title Text 
    cx.globalAlpha = 0.8;
    // uiT[0].render();
    uiT[28].render();
    uiT[29].render();
    uiT[30].render();
    // Wallet info / highlight
    uiT[11].render();

    cx.globalAlpha = 0.25;
    // Debug
    if(mobile) {
        uiT[10].render();
    } else {
        uiT[9].render();
    }

    if(highlight >= 0.02) {
        highlight -= 0.02;
    }
    cx.globalAlpha = highlight;
    drawB(0, .91, w, .1, c0); // base banner
    // drawB(.04, .91, .91, .05, c0);

    cx.globalAlpha = 1.0;

    renderSuits(.05, .22, 0);
    renderSuits(.15, .22, 1);
    renderSuits(.81, .22, 2);
    renderSuits(.91, .22, 3);
    // cx.font = "normal bold 22px monospace";
    // cx.fillText("TITLE", 0.45*w, 0.25*h);
    
}

function renderOptions(timestamp) {
    cx.globalAlpha = 0.8;
    drawB(0, 0, w, h, c3); //bg
    
    cx.globalAlpha = 0.1;
    uiS[1].render();
    cx.globalAlpha = 0.8;

    uiT[2].render();
    uiT[20].render();
    uiT[21].render();
    uiT[22].render();
    uiT[23].render();

    renderButtons();
}
function renderCredits(timestamp) {
    cx.globalAlpha = 0.8;
    drawB(0, 0, w, h, '#424'); //bg

    cx.globalAlpha = 0.4;
    uiS[1].render();
    cx.globalAlpha = 0.8;

    uiT[3].render();
    uiT[4].render();
    uiT[5].render();
    uiT[12].render();
    uiT[13].render();
    uiT[14].render();
    uiT[15].render();
    
    uiT[24].render();

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

function debugMouse() {
    drawB((mouseX/w)-0.01, (mouseY/h)-0.02, 0.02, 0.04, '#22AAFF50');
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
        getMousePos(e, c);
        logicCheckHOV();
        logicCheckCLK();
    });
    // Pointer cancel - the same as pointer up, but for mobile specific cases
    c.addEventListener('pointercancel', (e) => {
        // console.log("pointercancel");
        logicCheckUP();
        pointerReleased()
    });
    c.addEventListener('pointerup', (e) => {
        // console.log("pointerup");
        logicCheckUP();
        pointerReleased()
    });
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
            genSPR(pA, c7, spriteActors)
            console.log('spriteActors sprites generated...');
            cg.canvas.width = 5; cg.canvas.height = 6;
            genSPR(p6B, c7, spriteIcons);
            console.log('spriteIcons Black sprites generating...');
            cg.canvas.width = 5; cg.canvas.height = 6;
            genSPR(p6R, c6, spriteIcons);
            
            setTimeout(() => {
                console.log('spriteIcons Red array of sprites generating...');
                cg.canvas.width = 3; cg.canvas.height = 4;
                genSPR(p4, c0, fntW);
                genSPR(p4, c7, fntB);
                genSPR(p4, c6, fntR);
                console.log('fntW, fntB, fntR array(s) of sprites generating...');
                cg.canvas.width = 9; cg.canvas.height = 12;
                genSPR(p9, '#101', sprN);
                console.log('sprN array of sprites generating...');
                cg.canvas.width = 12; cg.canvas.height = 12;
                genSPR(p12, c6, sprS);
                console.log('sprS array of sprites generating...');
                
                setTimeout(() => {                                                        //extra chars
                    cg.canvas.width = 5; cg.canvas.height = 4;
                    genSPR(p5, c0, fntW);
                    genSPR(p5, c6, fntR);
                    genSPR(p5, c7, fntB);

                    setTimeout(() => {
                        cg.canvas.width = 9; cg.canvas.height = 12;
                        genMiniCards(9, 12);
                        console.log('Mini Card sprites generating...');
        
                        setTimeout(() => {
                            cg.canvas.width = 18; cg.canvas.height = 18;
                            genSPR(p18, c5, sprS);
                            console.log('sprS array of sprites generating more...');
                                

                            setTimeout(() => {
                                if(debug) { // Debugs sprite arrays now generated
                                    debugArrays();
                                }
                                
                                // playerCardHand[0] = new card('A', deckPos, cardASlots[0], generateNumber(rng, 1, 4), generateNumber(rng, 1, 10), 0, 0);
                                tCard = new card('T', {x: 0.795, y: 0.6}, {x: 0.795, y: 0.41}, generateNumber(rng, 0, 3), 13, -0.5, false);

                                for (let i=0; i<=6;i++) {
                                    let rPos = 
                                    {x: generateNumber(rng, 0.1, 0.75), y: generateNumber(rng, -0.4, -0.9)};
                                    let rSpd = generateNumber(rng, -0.8, -1.5);

                                    titleCds[i] = new card('A', rPos, rPos, generateNumber(rng, 0, 3), null, rSpd, true);
                                };

                                if(debug) { recalcDebugArrays(); recalcStats(); }

                            }, 400);
                    
                            setupUI();

                            // Draw canvas backing
                            cx.clearRect(0, 0, cvs.width, cvs.height);
                            cx.fillStyle = '#111';
                            cx.fillRect(0, 0, cvs.width, cvs.height);
                        
                            zzfx(...[.5*mVo,,582,.02,.02,.05,,.5,,,,,,,36,,,.81,.02]); // Load
                        }, 500);
                    }, 200);
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
        new uix(2, .04, .408, .15, .1, '#2AF', 'START', null, .0002), // 1
        new uix(2, .04, .55, .20, .08, c3, 'OPTIONS', null, 0), // 2
        new uix(2, .04, .65, .20, .08, c3, 'CREDITS', null, 0), // 3
        new uix(2, .05, .1, .17, .08, c2, 'BACK', null, 0), // 4
        new uix(2, .81, .82, .16, .11, '#2AF', 'CONT', null, .0003), // 5
        new uix(2, .81, .82, .16, .11, '#2AF', 'NEXT', null, .0003), // 6
        new uix(2, .28, .65, .23, .06, '#2AF', 'CONTINUE', null, .0002), // 7 REPLAY
        new uix(2, .56, .65, .15, .06, c6, 'QUIT', null, .0002), // 8
        new uix(2, .04, .78, .42, .1, c2, 'CONNECT WALLET', null, 0), // 9
        new uix(2, .01, .94, .1, .1, c2, '...', null, 0), // 10
        new uix(2, .2, .36, .1, .1, c5, 'OFF', null, 0), // 11
        new uix(2, .3, .36, .1, .1, c5, '25%', null, 0), // 12
        new uix(2, .4, .36, .1, .1, c5, '50%', null, 0), // 13
        new uix(2, .5, .36, .1, .1, c5, '75%', null, 0), // 14
        new uix(2, .6, .36, .1, .1, c6, '100%', null, 0), // 15
        new uix(2, .2, .56, .1, .1, c6, 'OFF', null, 0), // 16
        new uix(2, .3, .56, .1, .1, c5, '25%', null, 0), // 17
        new uix(2, .4, .56, .1, .1, c5, '50%', null, 0), // 18
        new uix(2, .5, .56, .1, .1, c5, '75%', null, 0), // 19
        new uix(2, .6, .56, .1, .1, c5, '100%', null, 0), // 20
        new uix(2, .65, .82, .3, .1, c8, 'START ROUND', null, 0), // 21
        new uix(2, .65, .82, .3, .1, c8, 'NEXT ROUND', null, 0), // 22
    ];
    uiT = [
        new uix(1, .22, .1, 3.5, 0, null, 'JS13K TITLE', null),
        new uix(1, .05, .5, 1.5, 0, null, 'DSC', null),
        new uix(1, .35, .2, 3, 0, null, 'OPTIONS', null),
        new uix(1, .35, .2, 3, 0, null, 'CREDITS', null),
        new uix(1, .20, .35, 2, 0, null, 'A GAME BY ALEX_ADEDGE', null),
        new uix(1, .30, .40, 2, 0, null, 'FOR JS13K 2024', null),
        new uix(1, .33, .44, 2, 0, null, 'END OF ROUND', null), // 6
        new uix(1, .34, .52, 2, 0, null, 'PLAYER WINS', null), // 7
        new uix(1, .36, .52, 2, 0, null, 'PLAYER LOSES', null), // 8
        new uix(1, .77, .83, 1.5, 0, null, '|BROWSER|', null), // 9
        new uix(1, .77, .83, 1.5, 0, null, '|MOBILE|', null), // 10
        new uix(1, .06, .925, 1, 0, null, 'NOT CONNECTED', null), // 11
        new uix(1, .31, .54, 1.8, 0, null, 'SPECIAL THANKS:', null), //12
        new uix(1, .31, .62, 1.5, 0, null, 'FRANK FORCE - ZZFX', null), //13
        new uix(1, .28, .66, 1.5, 0, null, 'KEITH CLARK - ZZFXM', null), //14
        new uix(1, .25, .70, 1.5, 0, null, 'CSUBAGIO - SHADER SETUP', null), //15
        new uix(1, .15, .29, 1.5, 0, null, 'TURN X OF X', null), //16
        new uix(1, .25, .29, 1.5, 0, null, 'X', null), //17
        new uix(1, .05, .05, 2, 0, null, 'GAME I', null), //18
        new uix(1, .40, .52, 2, 0, null, 'DRAW', null), //19
        new uix(1, .2, .3, 2, 0, null, 'MASTER VOLUME', null), //20
        new uix(1, .2, .5, 2, 0, null, 'MUSIC', null), //21
        new uix(1, .06, .75, 2, 0, null, 'I ran out of bytes for music :|', null), //22
        new uix(1, .06, .8, 2, 0, null, 'please byo music', null), //23
        new uix(1, .25, .80, 1.5, 0, null, 'JS13K HOSTS AND JUDGES!', null), //24
        new uix(1, .05, .50, 2, 0, null, 'X', null), //25 - Discards
        new uix(1, .15, .80, 2, 0, null, 'X', null), //26 - Hand
        new uix(1, .07, .12, 2, 0, null, 'CARDS IN DECK:', null), //27 - Hand
        new uix(1, .1, .1, 4, 0, null, 'THE ANTI-', null), //28
        new uix(1, .61, .1, 4, 0, null, 'POKER', null), //29
        new uix(1, .28, .22, 4.3, 0, null, 'PROTOCOL', null), //30
        new uix(1, .08, .12, 2.5, 0, null, '|PRIMARY OBJECTIVE|', null), //31
        new uix(1, .08, .2, 4, 0, null, 'WIN POKER', null), //32
        new uix(1, .08, .34, 2, 0, null, 'VIABLE POKER HANDS:', null), //33
        new uix(1, .08, .4, 1.5, 0, null, '- HIGH CARD', null), //34
        new uix(1, .08, .45, 1.5, 0, null, '- PAIR', null), //35
        new uix(1, .08, .5, 1.5, 0, null, '- TWO PAIR', null), //36
        new uix(1, .08, .55, 1.5, 0, null, '- THREE OF A KIND', null), //37
        new uix(1, .08, .6, 1.5, 0, null, '- STRAIGHT', null), //38
        new uix(1, .08, .65, 1.5, 0, null, '- FLUSH', null), //39
        new uix(1, .08, .7, 1.5, 0, null, '- FULL HOUSE', null), //40
        new uix(1, .08, .75, 1.5, 0, null, '- FOUR OF A KIND', null), //41
        new uix(1, .08, .8, 1.5, 0, null, '- STRAIGHT FLUSH', null), //42
        new uix(1, .08, .85, 1.5, 0, null, '- ROYAL FLUSH', null), //43
        new uix(1, .65, .5, 2, 0, null, 'OPPONENT:', null), //44
        new uix(1, .65, .58, 2, 0, null, 'NAME', null), //45
        new uix(1, .75, .68, 1.5, 0, 2, 'DEFEAT IN', null), //46
        new uix(1, .78, .74, 1.5, 0, 2, ' ROUNDS', null), //47
        new uix(1, .08, .12, 2.5, 0, null, '|END OF ROUND|', null), //48
        new uix(1, .08, .2, 3, 0, null, 'UPGRADE - CONTINUE', null), //49
        new uix(1, .08, .2, 4, 0, null, 'GAME OVER', null), //50
        new uix(1, .14, .17, 3, 0, null, 'INFO - HOW TO PLAY', null), //51
        new uix(1, .134, .58, 1, 0, 2, '- DISCARD CARDS HERE', null),
        new uix(1, .27, .64, 1, 0, 2, '- PLAY CARDS TO THE TABLE HERE', null),
        new uix(1, .29, .67, 1, 0, 2, '|THESE CARDS ARE VISIBLE TO ALL|', null),
        new uix(1, .54, .75, 1, 0, 2, '- THIS IS YOUR HAND OF CARDS', null),
        new uix(1, .16, .25, 1.5, 0, null, 'MOVE CARDS FROM YOUR HAND (BELOW)', null),
        new uix(1, .16, .3, 1.5, 0, null, 'TO THE GAME TABLE. YOU MUST TRY', null),
        new uix(1, .16, .35, 1.5, 0, null, 'TO SCORE MORE THAN THE OPPONENT!!', null),
        new uix(1, .16, .40, 1.1, 0, 2, 'DEFEAT OPPONENT BEFORE YOU ARE OUT OF ROUNDS!!', null), //58
        new uix(1, .08, .4, 2, 0, 0, 'ROUND SCORE:', null), //60
        new uix(1, .08, .45, 2, 0, 0, 'SCORE TOTAL:', null), //61
        new uix(1, .43, .4, 2, 0, 0, '0', null), //62
        new uix(1, .43, .45, 2, 0, 0, '0', null), //63
        new uix(1, .08, .6, 2, 0, 0, 'POINTS TO UNLOCK 13 CARD:', null), //64
        new uix(1, .79, .6, 2, 0, 2, '20', null), //65
        new uix(1, .47, .54, 1, 0, null, 'CLICK DECK TO TOGGLE HELP ----', null), //66
        new uix(1, .16, .45, 1.4, 0, null, 'RANK ORDER: 2-3-4...10-J-Q-K-A-13', null), //67
        new uix(1, .16, .5, 1.4, 0, null, 'SUIT ORDER LOW TO HI:', null), //68
        new uix(1, .75, .74, 2.5, 0, 2, 'X', null), //69
        new uix(1, .05, .12, 1, 0, null, 'CARDS IN DECK:', null), //70
        new uix(1, .25, .12, 1, 0, null, 'X', null), //71
        new uix(1, .05, .15, 1, 0, null, 'ROUNDS LEFT:', null), //72
        new uix(1, .25, .15, 1, 0, null, 'X', null), //73
    ];
    uiS = [
        // ix, x, y, dx, dy, c, str, img
        new uix(0, .423, .795, .07, .07, null, '', sprS[0], 0), // AVAX sprite
        new uix(0, -.1, -.1, 3.2, 1.6, null, '', bg, .0002), // BG sprite
        new uix(0, .407, .018, .116, .13, null, '', spriteActors[1], 0), // NPC0 sprite
        new uix(0, .407, .018, .116, .13, null, '', spriteActors[2], 0), // NPC1 sprite
        new uix(0, .407, .018, .116, .13, null, '', spriteActors[3], 0), // NPC2 sprite
        new uix(0, .31, .47, .2, .2, null, '', sprS[1], 0), // Badge 0
        new uix(0, .41, .47, .2, .2, null, '', sprS[1], 0), // Badge 1
        new uix(0, .51, .47, .2, .2, null, '', sprS[1], 0), // Badge 2
        new uix(0, .61, .47, .2, .2, null, '', sprS[1], 0), // Badge 3
        // new uix(0, .68, .4, .15, .15, null, '', sprS[1], 0), // Badge 4
        // new uix(0, .28, .56, .15, .15, null, '', sprS[1], 0), // Badge 5
        // new uix(0, .38, .56, .15, .15, null, '', sprS[1], 0), // Badge 6
        // new uix(0, .48, .56, .15, .15, null, '', sprS[1], 0), // Badge 7
        // new uix(0, .58, .56, .15, .15, null, '', sprS[1], 0), // Badge 8
        // new uix(0, .68, .56, .15, .15, null, '', sprS[1], 0), // Badge 9
        // new uix(0, .48, .72, .15, .15, null, '', sprS[1], 0), // Badge 10
        // new uix(0, .58, .72, .15, .15, null, '', sprS[1], 0), // Badge 11
        // new uix(0, .68, .72, .15, .15, null, '', sprS[1], 0), // Badge 12
        
    ];
    newDeckStack();
    console.log("UI Setup Complete");
}

function genSPR(arr, c, out) {
    try {
        // Process each element in the array to generate a sprite
        arr.forEach((element, index) => {
                genSpriteImg(element, c, out);
                // loadPer++;
                // console.log(`Generated sprite for element ${index}:`, element + " now LoadPercent: " + loadPer);
        });
    } catch (error) {
        console.error('Error generating sprites:' + error);
    }
}

function newDeckStack() {
    deckStack = [
        new card(null, {x: deckPos.x, y: deckPos.y}, {x: deckPos.x, y: deckPos.y}, 4),
        new card(null, {x: deckPos.x+0.005, y: deckPos.y-0.005}, {x: deckPos.x+0.005, y: deckPos.y-0.005}, 4),
        new card(null, {x: deckPos.x+0.010, y: deckPos.y-0.010}, {x: deckPos.x+0.010, y: deckPos.y-0.010}, 4),
        new card(null, {x: deckPos.x+0.015, y: deckPos.y-0.015}, {x: deckPos.x+0.015, y: deckPos.y-0.015}, 4)
    ];
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
        cardGenQueueA[i] = new card('A', deckPos, deckPos, generateNumber(rng, 0, 3), generateNumber(rng, 0, 12));
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

            if(debug) { recalcDebugArrays(); recalcStats(); }
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
            setButtons([4, 11,12,13,14,15,16,17,18,19,20]);
            
            //---------------------
            break;
            case MAIN_STATES.GAMEROUND:
                console.log('MAIN_STATES.GAMEROUND State started ...');
                statePrev = stateMain;
                //---------------------
                // setButtons([10]);
                // uiT[16].updateSTR('turn ' + turn + ' OF ' + turnMax);
                // uiT[17].updateSTR(turn);
                // highlightR = 1.0;
                // initRound = true; //reset
                // Start Game Sfx
                // zzfx(...[0.6*mVo,0,65.40639,.11,.76,.41,1,.7,,,,,.31,,,,,.55,.05,.42]);
            uiT[71].updateSTR(deckTotal); // update deck total
            uiT[69].updateSTR(roundMax); // update round max
            uiT[73].updateSTR(roundMax-round); // update round max
                
            setButtons([10,21]);
            stateRound = ROUND_STATES.PRE; //start game turn
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
        case ROUND_STATES.PRE:
            console.log('ROUND_STATES.PRE State started ...');
            stateRPrev = stateRound;
            //---------------------

            //---------------------
            break;
        case ROUND_STATES.INTRO:
            console.log('ROUND_STATES.INTRO State started ...');
            stateRPrev = stateRound;
            //---------------------
            uiT[16].updateSTR('turn ' + turn + ' OF ' + turnMax);
            uiT[17].updateSTR(turn);
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
            
            // SFX for play START
            zzfx(...[0.75*mVo,,37,.06,.01,.36,3,1.8,,,,,,.4,63,.4,,.38,.14,.12,-1600]);
            setTimeout(() => {
                let ch = npcOp.makeMove();
                if(ch == 1) { // Deal Card to table
                    // let topCard = getTopCard(opponentCardHand);
                    // moveCardToArray([opponentCardHand, topCard[0]], tableCardHoldB);
                    // tableCardHoldB[tableCardHoldB.length-1].setsP(tableBSlots[tableCardHoldB.length-1]);
                    // tableCardHoldB[tableCardHoldB.length-1].flipCard(false);
                    // tableCardHoldB[tableCardHoldB.length-1].setSettled(false);
                    // zzfx(...[.2*mVo,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); // pickup quick

                    
                } else if(ch == 2) { // Discard Card
                    // opponentCardHand[0].setsP(dscPos);
                    // opponentCardHand[0].setSettled(false);
                    // zzfx(...[.2*mVo,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); // pickup quick
                    // setTimeout(() => {
                    //     moveCardToArray([opponentCardHand, 0], dscQueue)
                    //     zzfx(...[.8*mVo,,81,,.07,.23,3,3,-5,,,,,.1,,.5,,.6,.06,,202]); // Hit Discard
                    //     discarded++;
                    // }, 800);
                }
            }, 1100);
            //---------------------
            break;
        case ROUND_STATES.NEXT:
            console.log('ROUND_STATES.NEXT State started ...');
            stateRPrev = stateRound;
            //---------------------

            setButtons([10]);
            if (turn < turnMax) {
                initNext = true; // Reset if more rounds left
            } else {
                // setTimeout(() => {
                stateRound = ROUND_STATES.END;
                // }, 400);
            }
            //---------------------
            break;
        case ROUND_STATES.POST:
            console.log('ROUND_STATES.POST State started ...');
            stateRPrev = stateRound;
            //---------------------
            
            setButtons([10,22]);
            //---------------------
            break;
        case ROUND_STATES.END:
            console.log('ROUND_STATES.END State started ...');
            stateRPrev = stateRound;
            //---------------------        
            setButtons([0]);
            roundEnd = true;
            first = false; // end tutorial note
            playerWin = findWinner(tableCardHoldA, tableCardHoldB);
            // Reset text for end condition
            if(playerWin == 1) { // WIN
                // uiB[7].updateSTR("CONTINUE")
                txtBoxBtxt.updateSTR(npcOp.getRandomTxt(3));
            } else if (playerWin == -1 || playerWin == 0){ // LOSS
                txtBoxBtxt.updateSTR(npcOp.getRandomTxt(2));
            }
            setTimeout(() => {
                txtBoxB = true;
                // Speech sfx
                zzfx(...[,.3*mVo,138,,.03,.03,3,1.8,-18,,2,.04,,.1,16,,,.62,.03]);
            }, 900);
            setTimeout(() => {
                zzfx(...[1.2*mVo,,9,.01,.02,.01,,2,11,,-305,.41,,.5,3.1,,,.54,.01,.11]); // click
                setButtons([7,8]);
            }, 2000);

            //---------------------
            break;

        case ROUND_STATES.RESET:
            console.log('ROUND_STATES.RESET State started ...');
            stateRPrev = stateRound;
            //---------------------
            // turn settings reset
            roundEnd = false;
            txtBoxB = false;
            initRound = true;
            roundStart = true;
            chooseA = true;
            turn = 1;
            uiT[16].updateSTR('turn ' + turn + ' OF ' + turnMax);
            uiT[17].updateSTR(turn);
            playerWin = false;
            // Game State reset
            cardNum = 0;
            deckTotal = 52;
            discarded = 0;
            quaterTrack = 0;
            dOffset = 0;
            newDeckStack();
            // Reset card arrays
            currentHeld = null;
            playerCardHand = [];
            opponentCardHand = [];
            tableCardHoldA = [];
            tableCardHoldB = [];
            cardGenQueueA = [];
            dscQueue = [];

            oHigh = -1;
            oTwoP = false;
            oDups = [];
            oFlsh = ['x','x','x','x'];
            oStrt = [];
            
            pHigh = -1;
            pTwoP = false;
            pDups = [];
            pFlsh = 0;
            pStrt = [];

            npcOp = null;

            // if(debug) {removeDebug();}
            if(debug) {recalcDebugArrays(); recalcStats();}
            
            stateRound = ROUND_STATES.INTRO;
            //---------------------
            break;

        default:
            console.log('turn State:???? Process in unknown state, return to title');
            console.log('Resetting Game State');
            stateMain = MAIN_STATES.TITLE; // Default to title
            stateRound = ROUND_STATES.RESET; // Default to title
            // statePrev = stateMain;
            // stateRPrev = stateRound;
            break;
    }
}

function tickGame(timestamp) {
    if(stateRound == ROUND_STATES.PRE) {
        if(initRound) {
            // Create all cards for queue
            generateCardsFromDeck(handSize*2);
            
            // Create NPC opponent
            if(round == 1) {
                npcOp = new npc('01', 'CLAUD', 1, null, 2);
                uiT[45].updateSTR("CLAUD");
            } else if (round == 2) {
                npcOp = new npc('02', 'DAEMON', 2, null, 3);
                uiT[45].updateSTR("DAEMON");
            } else if (round == 3) {
                npcOp = new npc('03', 'HEATHER', 3, null, 4);
                uiT[45].updateSTR("HEATHER");
            } else if (round == 4) {
                npcOp = new npc('04', 'SPEED', 4, null, 5);
                uiT[45].updateSTR("SPEED");
            }
            
            // Get new intro text
            txtBoxBtxt = new uix(1, txtBoxPos.x, txtBoxPos.y, 1.5, 0, null, npcOp.getRandomTxt(0) , null);
            initRound = false;
        }
    } else if(stateRound == ROUND_STATES.INTRO) {
        
        // Start turn with speech text
        if(roundStart) {
            setTimeout(() => {
                txtBoxB = true;
                // Speech sfx
                zzfx(...[,.3*mVo,138,,.03,.03,3,1.8,-18,,2,.04,,.1,16,,,.62,.03]);
            }, 500);
            setTimeout(() => {
                setButtons([5, 10]);
            }, 1000);
            roundStart = false;
        }
    } else if (stateRound == ROUND_STATES.DEAL) {
        // Count cards in players hands
        let cardCount = playerCardHand.length + opponentCardHand.length;
        // Generate new cards as needed 
        // If all cards are delt out, toggle to play
        if(cardCount >= handSize*2) {
            setTimeout(() => {
                resetSlotPositions(cardASlots, playerCardHand);
                resetSlotPositions(cardBSlots, opponentCardHand);
                resetSlotPositions(tableBSlots, tableCardHoldB);
                // resetSlotPositions(tableASlots, tableCardHoldA);

                if(debug) { recalcDebugArrays(); recalcStats(); }

                stateRound = ROUND_STATES.PLAY;
            }, 600);
        } else {
            setTimeout(() => {
                const delayBetweenCards = 160; // 500ms delay between cards
                // if(chooseA) {
                if(timestamp - lastCardCreationTime >= delayBetweenCards) {
                    // console.log("playerCardHand: " + playerCardHand.length);
                    // console.log("opponentCardHand: " + opponentCardHand.length);
                    if(chooseA) {
                        // console.log("TIMER A");
                        if(playerCardHand.length < handSize) {
                            generateCardsFromDeck(1);
                            cardTransferArray(true);
                        }
                        chooseA = false;   
                    } else {
                        // console.log("TIMER B");
                        if(opponentCardHand.length < handSize) {
                            generateCardsFromDeck(1);
                            cardTransferArray(false);
                        }
                        chooseA = true;
                    }
                    lastCardCreationTime = timestamp;
                    if(debug) { recalcDebugArrays();}
                }
            }, 300);
        }
    } else if (stateRound == ROUND_STATES.PLAY) {
        
    // card bop 
    if(bop > 0) {
        bop -= 0.02;
    } else {
        setTimeout(() => {
            if(playerCardHand[0] != null) {
                let ck = checkClose(playerCardHand[0].getsP(), playerCardHand[0].getPos());
                if(!ck) {
                    playerCardHand[0].pos.y -= 0.02;
                    playerCardHand[0].setSettled(false);}
                // console.log("pos: " + playerCardHand[0].getPos().y);
                // console.log("sP: " + playerCardHand[0].getsP().y);
                // console.log("pos: " + playerCardHand[0].getPos().y);
            }
        }, 200);
        setTimeout(() => {
            if(playerCardHand[1] != null) {
                let ck = checkClose(playerCardHand[1].getsP(), playerCardHand[1].getPos());
                if(!ck) {
                    playerCardHand[1].pos.y -= 0.02;
                    playerCardHand[1].setSettled(false);}
            }
        }, 400);
        setTimeout(() => {
            if(playerCardHand[2] != null) {
                let ck = checkClose(playerCardHand[2].getsP(), playerCardHand[2].getPos());
                if(!ck) {
                    playerCardHand[2].pos.y -= 0.02;
                    playerCardHand[2].setSettled(false);}
            }
        }, 600);
        setTimeout(() => {
            if(playerCardHand[3] != null) {
                let ck = checkClose(playerCardHand[3].getsP(), playerCardHand[3].getPos());
                if(!ck) {
                    playerCardHand[3].pos.y -= 0.02;
                    playerCardHand[3].setSettled(false);}
            }
        }, 800);
        setTimeout(() => {
            if(playerCardHand[4] != null) {
                let ck = checkClose(playerCardHand[4].getsP(), playerCardHand[4].getPos());
                if(!ck) {
                    playerCardHand[4].pos.y -= 0.02;
                    playerCardHand[4].setSettled(false);}
            }
        }, 1000);
        
        //Reset
        bop = 4;
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
        let hovT = checkHoverArea(.115, .5, 77, .28)
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
    hovC = checkHoverArea(.862, .38, .118, .24,)
    if(hovC) {
        deckActive = true;
    } else {
        deckActive = false;
    }

    } else if (stateRound == ROUND_STATES.NEXT) {
        
        if(initNext) {
            turn++;
            uiT[16].updateSTR('TURN ' + turn + ' OF ' + turnMax);
            uiT[17].updateSTR(turn);
            highlightR = 1.0;
            // Console.log("generate next cards: ");
            if (turn <= turnMax) {
                // if((cardCount) < handSize*2 ) {
                //     generateCardsFromDeck((handSize*2) - cardCount);
                // }
                // Selects who gets a card first for order sake
                if(playerCardHand.length <= opponentCardHand.length) {
                    chooseA = true;
                } else {
                    chooseA = false;
                }
                // Reset text
                txtBoxBtxt.updateSTR(npcOp.getRandomTxt(1));
                // Reset back to turn intro
                setTimeout(() => {
                    roundStart = true;
                    stateRound = ROUND_STATES.INTRO;
                }, 400);
            }
            initNext = false;
        }
    } else if (stateRound == ROUND_STATES.POST) {

    } else if (stateRound == ROUND_STATES.END) {
    
    }

}

function checkClose(pos1, pos2) {
    let distance = Math.sqrt(
        Math.pow(pos2.x - pos1.x, 2) +
        Math.pow(pos2.y - pos1.y, 2) );
    // console.log("distance: " + distance);
    // console.log(distance > 0.02);
    return distance > 0.02;
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
            playerCardHand[i].checkHover(false);
        }
    }
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            titleCds[i].checkHover(false);
        }
    }
    // Reset buttons
    clickPress = false;
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].checkHover(false);
        // console.log("reset");
    }
    // Drop current held
    if(currentHeld != null) {
        zzfx(...[.3*mVo,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
        currentHeld = null;
    }
}

// ONLY check for card hovers
function logicCheckHOV() {
    let check = false;
    if(stateMain == MAIN_STATES.GAMEROUND && 
        stateRound == ROUND_STATES.PLAY ) {
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
        for (let i = 0; i < tableCardHoldA.length; i++) {
            if(tableCardHoldA[i] != null) {
                if (tableCardHoldA[i].checkHover(mouseX, mouseY, w, h)) {    
                    check = true;
                    currentHover = tableCardHoldA[i];
                    if(currentHeld == null) {
                        tableCardHoldA[i].isHov = true;
                    }
                } else {
                    tableCardHoldA[i].isHov = false;
                }
            }
        }
    }
    if(stateMain == MAIN_STATES.TITLE) {
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
    }
    //Only place to check button hover
    for (let i = 1; i < uiB.length; i++) {
        let butHov = uiB[i].checkHover(true);
        if(!butHov) { //disable with no hover
            uiB[i].checkHover(false);
        }
    }
}
// Mouse Click
// Only check on 
function logicCheckCLK() {

    if(deckActive) {
        if(tut) {
            tut = false;
            console.log("Close Tutorial mode");
        } else {
            tut = true;
            console.log("Open Tutorial mode");
        }
    }

    // Button checks
    for (let i = 1; i < uiB.length; i++) {
        let checkD = uiB[i].checkClick(true);
        if(checkD) {
            clickPress = i;
            console.log("Button clicked: " + i);
        }
    }
    if(currentHover == null) {
        checkButtonClicks();
    }
    // Card Checks for grab & shuffle
    if(stateMain == MAIN_STATES.GAMEROUND) {
        for (let i = playerCardHand.length; i >= 0; i--) {
            if(playerCardHand[i] != null && currentHover != null) {
                var click = playerCardHand[i].checkClick(true);
                if(click) {
                    //shuffle card order
                    let inx = shuffleCardToTop(playerCardHand, i)
                    currentHeld = [playerCardHand, inx];
                    // Pickup quick sfx
                    zzfx(...[.2*mVo,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
                    // console.log("currentHeld: " + currentHeld );
                    return;
                }
            }
        }
        for (let i = tableCardHoldA.length; i >= 0; i--) {
            if(tableCardHoldA[i] != null && currentHover != null) {
                var click = tableCardHoldA[i].checkClick(true);
                if(click) {
                    //shuffle card order
                    let inx = shuffleCardToTop(tableCardHoldA, i)
                    currentHeld = [tableCardHoldA, inx];
                    // Pickup quick sfx
                    zzfx(...[.2*mVo,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
                    return;
                }
            }
        }
    } else if(stateMain == MAIN_STATES.TITLE) {
        for (let i = titleCds.length; i >= 0; i--) {
            if(titleCds[i] != null && currentHover != null) {
                var click = titleCds[i].checkClick(true);
                if(click) {
                    currentHeld = titleCds[i];
                    // Pickup quick sfx
                    zzfx(...[.2*mVo,.5,362,.07,.01,.17,4,2.3,,,,,.06,.8,,,,0,.01,.01,-2146]); 
                    return;
                }
            }
        }
    }

}
// Pointer click up, basically check for buttons, 
// drop held card, and reset everything 
function logicCheckUP() { // pointer up
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
        console.log("Dropping held: " + currentHeld);
        zzfx(...[.3*mVo,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
        
        if(stateRound == ROUND_STATES.PLAY) {
            if(tableActive) {
                moveCardToArray(currentHeld, tableCardHoldA)
                currentHeld = null;
            } else if(handActive) {
                moveCardToArray(currentHeld, playerCardHand)
                currentHeld = null;
            } else if(dscActive) {
                zzfx(...[.8*mVo,,81,,.07,.23,3,3,-5,,,,,.1,,.5,,.6,.06,,202]); // Hit Discard
                discarded++;
                moveCardToArray(currentHeld, dscQueue)
                currentHeld = null;
            }
        }
        // Reset currentHeld to nothing
        currentHeld = null;
        // console.log("Current held reset");
    }
}

function checkButtonClicks() {
    if(clickPress != false && clkDel <= 0) {
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
        } else if (clickPress == 7) { // Replay - Continue
            setButtons([10]); // Disable all buttons
            stateRound = ROUND_STATES.POST;
            // Start Game Sfx
            zzfx(...[0.6*mVo,0,65.40639,.11,.76,.41,1,.7,,,,,.31,,,,,.55,.05,.42]);
    
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
            setButtons([]);
            stateRound = ROUND_STATES.RESET;
            stateMain = MAIN_STATES.TITLE;
        } else if (clickPress == 11) { // Volume Off
            mVo = 0;
            resetCmV();
            uiB[11].updateCOL(c6);
        } else if (clickPress == 12) { // 25%
            mVo = .25;
            resetCmV();
            uiB[12].updateCOL(c6);
        } else if (clickPress == 13) { // 50%
            mVo = .5;
            resetCmV();
            uiB[13].updateCOL(c6);
        } else if (clickPress == 14) { // 75%
            mVo = .75;
            resetCmV();
            uiB[14].updateCOL(c6);
        } else if (clickPress == 15) { // 100%
            mVo = 1;
            resetCmV();
            uiB[15].updateCOL(c6);
        // } else if (clickPress == 16) { // Volume Off
        //     uVo = 0;
        //     resetCmM();
        //     uiB[16].updateCOL(c6);
        // } else if (clickPress == 17) { // 25%
        //     uVo = .25;
        //     resetCmM();
        //     uiB[17].updateCOL(c6);
        // } else if (clickPress == 18) { // 50%
        //     uVo = .5;
        //     resetCmM();
        //     uiB[18].updateCOL(c6);
        // } else if (clickPress == 19) { // 75%
        //     uVo = .75;
        //     resetCmM();
        //     uiB[19].updateCOL(c6);
        // } else if (clickPress == 20) { // 100%
        //     uVo = 1;
        //     resetCmM();
        //     uiB[20].updateCOL(c6);
        } else if (clickPress == 21) { // Start turn
            setButtons([]);
            stateRound = ROUND_STATES.INTRO;
        } else if (clickPress == 22) { // Next turn (cont from POST)
            resetALL();
            setButtons([10,21]);
            stateRound = ROUND_STATES.PRE;
        }
        
        zzfx(...[1.2*mVo,,9,.01,.02,.01,,2,11,,-305,.41,,.5,3.1,,,.54,.01,.11]); // click
        clkDel = 0.5; //reset click delay
    }
    // Reset buttons
    clickPress = false;
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].checkHover(false);
    }
}

function resetCmV() {
    uiB[11].updateCOL(c5);
    uiB[12].updateCOL(c5);
    uiB[13].updateCOL(c5);
    uiB[14].updateCOL(c5);
    uiB[15].updateCOL(c5);
}
function resetCmM() {
    uiB[16].updateCOL(c5);
    uiB[17].updateCOL(c5);
    uiB[18].updateCOL(c5);
    uiB[19].updateCOL(c5);
    uiB[20].updateCOL(c5);
}

function resetSlotPositions(positions, array) {
    for(let i=0; i < array.length; i++) {
        array[i].setsP(positions[i]);
        array[i].setSettled(false);
    }
}
function unSettleNewCard(positions, array) {
    let i = array.length-1;
    array[i].setsP(positions[i]);
    array[i].setSettled(false);
}

// Shuffle given card, in index, to final spot in array
function shuffleCardToTop(array, index) {
    // Remove card at index
    const selectedCard = array.splice(index, 1)[0];
    // Add card back to top of stack with push        
    array.push(selectedCard);

    // resetSlots(array);

    if(debug) { recalcDebugArrays(); }
    return array.length-1;
}

// function resetSlots(array) {
//     // Set slot position to final in array
//     for (let i = 0; i < array.length; i++) {
//         if(array[i] != null) {
//             array[i].setsP(cardASlots[i]);
//         }
//     }
// }
function removeCardFromArray(array, index) {
    array.splice(index, 1);
}

function moveCardToArray(cHeld, moveTo) {
    let cHeldA = cHeld[0];
    let cIndex = cHeld[1];
    cHeldA[cIndex].resetOnDrop();
    // Add to moveTo array
    moveTo.push(cHeldA[cIndex]);
    // let index = playerCardHand.indexOf(cHeld[0])
    // Remove the object from given array
    if (cIndex !== -1) {
        cHeldA.splice(cIndex, 1);
    }
    if(debug) { recalcDebugArrays(); }
}

// Tracks when to decrement deck size
function dealCardCheck() {
    quaterTrack++;
    // Deck shrink check
    if(quaterTrack >= quater) {
        quaterTrack = 0; //reset
        dOffset -= 0.008; //shadow render offset
        removeCardFromArray(deckStack, deckStack.length-1);
    }
}

// Transfers cards from cardGenQUEUE to Player/Opponent
function cardTransferArray(choose) {
    if(choose) {
        if(cardGenQueueA.length > 0) {
            // Add the card to the playerCardHand
            playerCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            unSettleNewCard(cardASlots, playerCardHand);
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            // Update card stats
            cardNum++; deckTotal--;
            uiT[71].updateSTR(deckTotal);
            zzfx(...[.6*mVo,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
            dealCardCheck()
        }
    } else {
        if(cardGenQueueA.length > 0) {
            // Add the card to the opponentCardHand
            opponentCardHand.push(cardGenQueueA[cardGenQueueA.length-1]);
            opponentCardHand[opponentCardHand.length-1].flipCard(true);
            unSettleNewCard(cardBSlots, opponentCardHand);
            // Remove card from cardGenQueueA
            cardGenQueueA.splice(cardGenQueueA.length-1, 1);
            // Update card stats
            cardNum++; deckTotal--;
            uiT[71].updateSTR(deckTotal);
            zzfx(...[.6*mVo,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
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
            if (suit < 4) { 
                this.suit = suitOrder[suit];
            } else {
                this.suit = 'DCK'; 
            }
        }
        // if(suit == 1) { this.suit = 'SPD'; } 
        // else if (suit == 2) { this.suit = 'HRT'; } 
        // else if (suit == 3) { this.suit = 'DMD'; } 
        // else if (suit == 4) { this.suit = 'CLB'; } 
        // Assign Rank
        if(rank < 9) { this.rank = rank+2; }
        if(rank == 9) { this.rank = 'J';}
        if(rank == 10) { this.rank = 'Q';}
        if(rank == 11) { this.rank = 'K';}
        if(rank == 12) { this.rank = 'A';}
        if(rank == 13) { this.rank = '13';}

        if(this.flt) { //scaler
            this.s = 0.8;
        } else {
            this.s = 1; 
        }
            // Set Card Side (flopped or not)
        this.flp = false;
        if(this.cdID == 'B') { this.flp = true; }
        if(this.cdID == 'T') { this.s = 2; }
        // Setup images
        this.image = new Image();
        this.hld = new Image();
        // index for rank string
        if(rank != null) { this.rk = strToIndex(this.rank) }
        else { this.rk = null }

        this.setIMG();
        this.hld = sprM[5];
        // other variables
        this.isHov = false;
        this.isHld = false;
        this.isSet = false;
        //tollerence for position checks
        this.eps = 0.01; 
        // debug card on generation
        // this.printCard();
        
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
        // Spin Card
        if(this.sX != 0 && this.flt) { 
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
        }
        // Render card
        // Shadow first 
        if(this.isHld) {
            cx.fillStyle = '#00000035';
            cx.fillRect((w*(this.pos.x - this.posi))-12, (h * this.pos.y)+11, (this.sX*this.s*1.4), (w/9)*this.s);
        } else {
            cx.fillStyle = '#00000025';
            cx.fillRect((w*(this.pos.x - this.posi))-7, (h * this.pos.y)+7, (this.sX*this.s*1.3), (w/11)*this.s);
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
            cx.drawImage(img, w * this.pos.x - 6, h * this.pos.y - 12, h/6.5*this.s, w/9.5*this.s ); }
            else if(this.isHld) { // Draw held 
            cx.drawImage(img, w * (this.pos.x - this.posi), h * this.pos.y, this.sX*this.s/.7, (w/9)*this.s ); } 
            else { // Just Draw
            cx.drawImage(img, w * (this.pos.x - this.posi), h * this.pos.y, this.sX*this.s/.8, (w/10)*this.s ); }
        }

        if(this.isHov) { // Hover and held color
            if(this.isHld) { 
                // cx.fillStyle = '#FFFFFF20'; 
                // cx.fillRect(w*(this.pos.x - this.posi), h * this.pos.y, this.sX*this.s/.7, w/9);
            } else {
                cx.fillStyle = '#3333FF50';
                cx.fillRect(w*(this.pos.x - this.posi), h * this.pos.y, this.sX*this.s/.8, w/10*this.s);
            }
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
        if(this.suit != 'DCK' && this.rk != null && this.flp != true) {
            // cx.font = "normal bolder 12px monospace";
            let ex=0;
            if(this.isHld){ex=0.004}
            if(this.suit == 'DMD' || this.suit == 'HRT') { 
                renderFont(this.pos.x+(ex+0.01*this.s), this.pos.y+(ex+0.019*this.s), w, h, this.s/.9, fntR, this.rk);
                // cx.fillStyle = '#900'; } 
            } else { 
                renderFont(this.pos.x+(ex+0.01*this.s), this.pos.y+(ex+0.019*this.s), w, h, this.s/.9, fntB, this.rk);
            }
                // cx.fillStyle = '#000'; }
            // cx.fillText(this.rank, (this.pos.x+0.0122)*w, (this.pos.y+0.032)*h);
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
            // zzfx(...[.6*mVo,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
            // console.log(this.rank + " SETTLED: " + this.pos.x + ", " + this.pos.y);
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
            if(this.isHov) { this.isSet = true; this.isHld = true; return true; }} 
        else { this.isHld = false; this.isHov = false; return false; }
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
    flipCard(val) {
        this.flp = val;
        this.setIMG();
    }
    setsP(pos) {
        this.sP.x = pos.x;
        this.sP.y = pos.y;
    }
    setPos(pos) {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
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
    getPos() {
        return this.pos;
    }
    getsP() {
        return this.sP;
    }
}
/////////////////////////////////////////////////////
// Opponent NPC Entity Class
/////////////////////////////////////////////////////
class npc {
    constructor(id, name, lvl, dial, hand) {
        this.id = id;
        this.name = name;
        this.lvl = lvl;
        this.dial = dial;
        this.hand = hand;

        this.handMake = 0; 
        // 0 = High card
        // 1 = Pair
        // 2 = Two Pair
        // 3 = Three of a kind 
        // 4 = Straight
        // 5 = Flush
        // 6 = Full House
        // 7 = Four of a Kind 
        // 8 = Straight Flush 
        // 9 = Royal Flush 
    }

    // Get random text from opponent
    getRandomTxt(num) {
        let str, arr;
        if(num == 0)        {arr = o1;
        } else if(num == 1) {arr = o2;
        } else if(num == 2) {arr = o3;
        } else if(num == 3) {arr = o4; }
        let r = generateNumber(rng, 0, arr.length-1);
        str = arr[r];

        console.log("Intro retrieved: " + str);
        return str;
    }

    makeMove() {
        let choice = 0;
        let eva = false;
        // Is it the final turn
        if(turn == turnMax) {
            console.log("Final turn - Opponent decides on move: Deal card to table");
            choice = 1;
        } else { // Any given turn
            choice = generateNumber(rng, 0, 2);
            // Evaluate
            // eva = generateBoolean(rng, .5);
            eva = true;
            console.log("Evaluation? " + eva);
            if(eva) {
                console.log("Opponent evaluates cards: ");
                this.evaluateHand();
                eva = false;
            }

            if(choice == 0) { // Nothing
                console.log("Opponent decides on move: Nothing");
            } else if (choice == 1) { // Deal out card
                console.log("Opponent decides on move: Deal card to table");
            } else { // Discard
                console.log("Opponent decides on move: Discard card");
            }
        }
        return choice;
    }

    evaluateHand() {
        console.log("////////////this.handMake: " + this.handMake);
        let pair = lookForPair(opponentCardHand, tableCardHoldB);
        console.log("////////////Pair found? " + pair);

    }
    getID() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getLvl() {
        return this.lvl;
    }
    getHand() {
        return this.hand;
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
        this.wx = 0; // wobble X
        this.wy = 0; // wobble Y

        this.isAc = false, this.isHov = false, this.clk = false, this.pld = false;
        if(str != null) {
            this.conv = strToIndex(this.str);
            // console.log("Converted string: " + this.conv);
        } // Buttons need to be activated via call
        if(this.ix != 2) { this.isAc = true; }
    }
    render() {
        // ACTIVE
        if(this.isAc) {
            // wobble
            if(this.w!=0) { 
                this.wobbleXY();
            }

            if(this.ix == 0) { //image
                cx.drawImage(this.img, (w * (this.x + this.wx)), h * (this.y + this.wy), h*this.dx, h*this.dy); }
            
            
            else if(this.ix == 1) { //text
                let fnt = fntW; // colour select
                if(this.c == 1) {fnt = fntB}
                if(this.c == 2) {fnt = fntR}
                // cx.drawImage(img, w * this.pos.x, h * this.pos.y, h/dx, w/dy);
                renderFont(this.x, this.y, w, h, this.dx, fnt, this.conv); }
            
            
            else if(this.ix == 2) { //button
                if(this.isHov) {
                    if(this.clk) {
                        cx.globalAlpha = 0.8;
                        drawB(this.x, this.y+this.wy, this.dx, this.dy, '#FFF')
                    } else {
                        cx.globalAlpha = 0.4;
                        drawB(this.x, this.y+this.wy, this.dx, this.dy, '#AAA') }
                    cx.globalAlpha = 0.5;
                    drawB(this.x, this.y+this.wy, this.dx, this.dy, this.c)
                } else {
                    cx.globalAlpha = 0.3;
                    drawB(this.x, this.y+this.wy, this.dx, this.dy, this.c) }
                cx.globalAlpha = 1.0;
                renderFont(this.x+0.02, this.y+this.wy+0.01, w, h, 1.6, fntW, this.conv);
                cx.globalAlpha = 0.8;
            } }
    }
    wobbleXY() {
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
    checkHover(val) {
        if(val) {
            if(this.isAc) {
                let hover = (mouseX >= w*this.x && mouseX <= (w*this.x) + w*this.dx 
                && mouseY >= h*this.y && mouseY <= (h*this.y) + h*this.dy);
                if(hover) {
                    this.isHov = true;
                    // Hover SFX, toggle if played
                    if(!this.pld) {
                        this.pld = true;
                        zzfx(...[3*mVo,,194,,.04,.02,,3,-7,,-50,.39,,,,,,.51,.02,.03,930]); // button hover
                    }
                    return true;
                }
            }
        } else {
            this.isHov = false;
            this.clk = false;
            this.pld = false;
        }
        return false;
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
        this.str = str.toString();
        this.conv = strToIndex(this.str);
    }
    updateCOL(c) {
        this.c = c;
    }
    updatePOS(x, y) {
        this.x = x;
        this.y = y;
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
        alert("Please install MetaMask / Not supported on mobile (yet)");
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

function debugArrays() {
    console.log("icon sprites: " + spriteIcons.length + " generated")
    console.log("actor sprites: " + spriteActors.length + " generated")
    console.log("font fntW letter sprites: " + fntW.length + " generated")
    console.log("font fntB letter sprites: " + fntB.length + " generated")
    console.log("font fntR letter sprites: " + fntR.length + " generated")
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
        debugDiv.style.right = '280px';
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
                slotP.textContent = `Slot${index}: ${slot.getRank()} of ${slot.getSuit()}s`;
            } else {
                slotP.textContent = `Slot${index}: ${slot}`;
            }
            // Append the paragraph to the container div
            debugDiv.appendChild(slotP);
        });
    }
    document.body.appendChild(debugDiv);
}

// var op = document.getElementById('o');
// var op1 = document.getElementById('o1');
// var op2 = document.getElementById('o2');
// var op3 = document.getElementById('o3');
// var op4 = document.getElementById('o4');
// function recalcStats() {
//     // High Card
//     let topC = getTopCard(opponentCardHand);
//     // const slotO1 = document.createElement('p');
//     op1.textContent = `high: ${opponentCardHand[topC[0]].getRank()} of ${opponentCardHand[topC[0]].getSuit()}`;
//     op1.style.color = '#2F2';
    
//     // Pair
//     let pairC = lookForPair(opponentCardHand, tableCardHoldB);
//     if(pairC != -1) {
//         op2.textContent = `pair:  ${cardOrder[pairC]}'s `;
        
//         op1.style.color = '#F22';
//         op2.style.color = '#2F2';
//     }else {
//         op2.textContent = `pair: N/A`;
//         op2.style.color = '#F22';
//     }

//     // Two pair
//     let pairT = lookForTwoPair(opponentCardHand, tableCardHoldB);
//     if(pairT[0] != -1) {
//         op3.textContent = `two pair:  ${cardOrder[pairT]}'s `;
        
//         op1.style.color = '#F22';
//         op2.style.color = '#F22';
//         op3.style.color = '#2F2';
//     }else {
//         op3.textContent = `two pair: N/A`;
//         op3.style.color = '#F22';
//     }
//     // Three of a kind
//     let three = lookForThree(opponentCardHand, tableCardHoldB);
//     if(three != -1) {
//         op4.textContent = `three oak:  ${cardOrder[three]}'s `;
        
//         op1.style.color = '#F22';
//         op2.style.color = '#F22';
//         op3.style.color = '#F22';
//         op4.style.color = '#2F2';
//     }else {
//         op4.textContent = `three oak: N/A`;
//         op4.style.color = '#F22';
//     }

//     document.body.appendChild(newDiv);
// }

var oHigh = -1;
var oTwoP = false;
var oDups = [];
var oFlsh = ['x','x','x','x'];
var oStrt = [];

var pHigh = -1;
var pTwoP = false;
var pDups = [];
var pFlsh = 0;
var pStrt = [];

function recalcStats() {
    //recalc
    calcsCards(opponentCardHand, tableCardHoldB);

    let dnew = document.getElementById('newDiv');
    if (dnew) { dnew.remove(); }

    const newDiv = document.createElement('div');
    newDiv.id = "newDiv";
    const title = document.createElement('h2');

    newDiv.classList.add("debugList");
    title.innerHTML = `&nbsp;Opponent CALC <BR>&nbsp;(known)`;
    newDiv.appendChild(title);
    
    const op0 = document.createElement('p'); // NPC
    const op1 = document.createElement('p'); // High Card
    const op2 = document.createElement('p'); // Pair
    const op3 = document.createElement('p'); // Two Pair
    const op4 = document.createElement('p'); // Three of a Kind
    const op5 = document.createElement('p'); // Straight
    const op6 = document.createElement('p'); // Flush
    const op7 = document.createElement('p'); // Full House
    const op8 = document.createElement('p'); // Four of a Kind
    // const op8 = document.createElement('p'); // Straight Flush
    // const op9 = document.createElement('p'); // Royal Flush
    
    // op1.textContent = `high: ${opponentCardHand[topC[0]].getRank()} of ${opponentCardHand[topC[0]].getSuit()}`;
    if(npcOp) {
        op0.style.color = '#88F';
        op0.textContent = `NPC: ${npcOp.getID()}, ${npcOp.getName()}, ${npcOp.getLvl()}, dial, ${npcOp.getHand()}`;
    }else {
        op0.textContent = `NPC: id, name, lvl, dial, hand`;
    }
    newDiv.appendChild(op0);

    // Duplicates
    if(oHigh != -1) {
        op2.style.color = '#55F';
        op4.style.color = '#55F';
        op8.style.color = '#55F';
        op2.textContent = `pair: x`;    
        op4.textContent = `three of a kind: x`;
        op6.textContent = `flush: SPDx HRTx DMDx CLBx`;
        op8.textContent = `four of a kind: x`;
    } else {
        op2.textContent = `pair: ?`;    
        op4.textContent = `three of a kind: ?`;
        op6.textContent = `flush: SPD[?] HRT[?] DMD[?] CLB[?]`;
        op8.textContent = `four of a kind: ?`;
    }
    if(oDups.length != 0) {
        op2.textContent = `pair:`;
        op4.textContent = `three of a kind:`;
        op8.textContent = `four of a kind:`;
    }
    for(let i = 0; i<oDups.length; i++) {
        if(oDups[i][1] == 2) { // Pair
            op2.style.color = '#5F5';
            op2.textContent += ` ${cardOrder[oDups[i][0]]},`;    
        } else {
            op2.textContent = `pair: x`;                
        }
        if(oDups[i][1] == 3) { // Three of a kind
            op4.style.color = '#5F5';
            op4.textContent += ` ${cardOrder[oDups[i][0]]},`;    
        } else {
            op4.textContent = `three of a kind: x`;                
        }
        if(oDups[i][1] == 4) { // Four of a kind
            op8.style.color = '#5F5';
            op8.textContent += ` ${cardOrder[oDups[i][0]]},`;    
        } else {
            op8.textContent = `four of a kind: x`;                
        }
        
    }

    // High Card
    if(oHigh != -1) {
        op1.textContent = `high: ${oHigh}`;
        op1.style.color = '#5F5';
        
        // Two Pair
        if(oTwoP) {
            op3.style.color = '#5F5';
            op3.textContent = `two pair: true`;
        } else {
            op3.style.color = '#55F';
            op3.textContent = `two pair: x`;
        }
        
        //Flush
        op6.textContent = `flush:`;
        op6.style.color = '#55F';
        if(oFlsh[3] >= 5) {
            op6.style.color = '#5F5';
        }
        op6.textContent += ` SPD[${oFlsh[3]}],`;  
        if(oFlsh[2] >= 5) {
            op6.style.color = '#5F5';
        }
        op6.textContent += ` HRT[${oFlsh[2]}],`;  
        if(oFlsh[1] >= 5) {
            op6.style.color = '#5F5';
        }
        op6.textContent += ` DMD[${oFlsh[1]}],`;  
        if(oFlsh[0] >= 5) {
            op6.style.color = '#5F5';
        }
        op6.textContent += ` CLB[${oFlsh[0]}]`;

    } else {
        op1.textContent = `high: ??`;
        op3.textContent = `two pair: ?`;

    }
    

    newDiv.appendChild(op1);
    newDiv.appendChild(op2);
    newDiv.appendChild(op3);
    newDiv.appendChild(op4);
    op5.textContent = `straight: ?`;
    newDiv.appendChild(op5);
    newDiv.appendChild(op6);
    op7.textContent = `full house: ?`;
    newDiv.appendChild(op7);
    newDiv.appendChild(op8);

    newDiv.style.top = '0px';    
    newDiv.style.right = '0px';  
    // newDiv.style.top = '0px';    
    // newDiv.style.left = '195px';  
    newDiv.style.width = '250px';  
    document.body.appendChild(newDiv);
}


function recalcDebugArrays() {
    genDebugArray(tableCardHoldA, 0);
    genDebugArray(playerCardHand, 1);
    genDebugArray(opponentCardHand, 2);
    genDebugArray(cardGenQueueA, 3);
    genDebugArray(tableCardHoldB, 4);
    genDebugArray(dscQueue, 5);
}

function removeDebug() {
    // let dnew = document.getElementById('newDiv');
    // if (dnew) { dnew.remove(); }

    // let dnew2 = document.getElementById('newDiv2');
    // if (dnew2) { dnew2.remove(); }

    // const debugDivs = document.querySelectorAll('div.debugList');
    // debugDivs.forEach(div => div.remove());

    // let d0 = document.getElementById('d0');
    // if (d0) { d0.remove(); }
    // let d1 = document.getElementById('d1');
    // if (d1) { d1.remove(); }
    // let d2 = document.getElementById('d2');
    // if (d2) { d2.remove(); }
    // let d3 = document.getElementById('d3');
    // if (d3) { d3.remove(); }
    // let d4 = document.getElementById('d4');
    // if (d4) { d4.remove(); }
    // let d5 = document.getElementById('d5');
    // if (d5) { d5.remove(); }

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