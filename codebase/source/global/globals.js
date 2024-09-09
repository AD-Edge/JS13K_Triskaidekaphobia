/////////////////////////////////////////////////////
// Global Variables
/////////////////////////////////////////////////////
// import './style.css';

var mobile, app, cvs, cx, w, h, asp, asp2, rect, rng, seed, currentHover, currentHeld, mouseX, mouseY, currentHover = null, currentHeld = null, maxPer, tCard, npcOp;
// var w2 = 720; var h2 = 540;
var w2 = 960; var h2 = 540;

var debug = true;
var webGL = true;

var deckTotal = 52;
var cardNum = 0, quaterTrack = 0, discarded = 0, dOffset = 0, lastCardCreationTime = 0, loadPer = 0;
var quater = Math.floor(deckTotal/4);
// console.log("Discards after " + quater + " cards...");

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
    {x: .27, y: .8},
    {x: .37, y: .8},
    {x: .47, y: .8},
    {x: .57, y: .8},
    {x: .67, y: .8},
];
var cardBSlots = [
    {x: .53, y: -.06},
    {x: .60, y: -.06},
    {x: .67, y: -.06},
    {x: .74, y: -.06},
    {x: .81, y: -.06},
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
var fntW = [], fntB = [], fntR = [];
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
var highlight = 1, highlightR = 0, clkDel = .5;
var round = 1;

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

            c.rgb = (0.8 + 0.6 * l) * vignetteEffect * step(0.4, v) * (0.8 + 0.3 * abs(sin(a.y * 2.14 * ${h2/2}.0)));
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