/////////////////////////////////////////////////////
// Global Variables
/////////////////////////////////////////////////////
// import './style.css';

var mobile, cvs, cx, w, h, asp, asp2, rect, rng, seed, currentHover, currentHeld, mouseX, mouseY, currentHover, currentHeld, maxPer;
var w2 = 720; var h2 = 540;

var debug = true;
var webGL = false;

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
    {x: 0.175, y: 0.84},
    {x: 0.325, y: 0.84},
    {x: 0.475, y: 0.84},
    {x: 0.625, y: 0.84},
    {x: 0.775, y: 0.84},
];
var cardBSlots = [
    {x: 0.450, y: 0.02},
    {x: 0.540, y: 0.02},
    {x: 0.630, y: 0.02},
    {x: 0.720, y: 0.02},
    {x: 0.810, y: 0.02},
];
const deckPos = {x: 0.5, y: 0.5};

// Card arrays for holding
var deckStack = [], cardGenQueueA = [], dscQueue = [], playerCardHand = [], opponentCardHand = [], tableCardHoldA = [], tableCardHoldB = [], titleCds = [];

// 8-Bit Color Registers
var cREG = ['#FFF', '#000', '#A33', 'A33', '0F0', '', '', '']

// In-memory canvas for graphics processing
const mCvs = document.createElement('canvas');
const cg = mCvs.getContext('2d');

// var cDP = document.getElementById("drawPad");
// var ctp = cDP.getContext('2d');

// SPRITE DATA
var sprM = [], sprN = [], sprS = [], spriteIcons = [], spriteActors = [];
// image arrays for fontA and fontNumbers
var fnt0 = [], fntA = [];
// Game UI Buttons/Text
var uiB = [], uiT = [], uiS = [];

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
var gl;


// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
const zzfx = (...t) => zzfxP(zzfxG(...t));
// zzfxP() - the sound player -- returns a AudioBufferSourceNode
const zzfxP = (...t) => { let e = zzfxX.createBufferSource(), f = zzfxX.createBuffer(t.length, t[0].length, zzfxR); t.map((d, i) => f.getChannelData(i).set(d)), e.buffer = f, e.connect(zzfxX.destination), e.start(); return e; };
// zzfxG() - the sound generator -- returns an array of sample data
const zzfxG = (q = 1, k = .05, c = 220, e = 0, t = 0, u = .1, r = 0, F = 1, v = 0, z = 0, w = 0, A = 0, l = 0, B = 0, x = 0, G = 0, d = 0, y = 1, m = 0, C = 0) => { let b = 2 * Math.PI, H = v *= 500 * b / zzfxR ** 2, I = (0 < x ? 1 : -1) * b / 4, D = c *= (1 + 2 * k * Math.random() - k) * b / zzfxR, Z = [], g = 0, E = 0, a = 0, n = 1, J = 0, K = 0, f = 0, p, h; e = 99 + zzfxR * e; m *= zzfxR; t *= zzfxR; u *= zzfxR; d *= zzfxR; z *= 500 * b / zzfxR ** 3; x *= b / zzfxR; w *= b / zzfxR; A *= zzfxR; l = zzfxR * l | 0; for (h = e + m + t + u + d | 0; a < h; Z[a++] = f)
    ++K % (100 * G | 0) || (f = r ? 1 < r ? 2 < r ? 3 < r ? Math.sin((g % b) ** 3) : Math.max(Math.min(Math.tan(g), 1), -1) : 1 - (2 * g / b % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(g / b) - g / b) : Math.sin(g), f = (l ? 1 - C + C * Math.sin(2 * Math.PI * a / l) : 1) * (0 < f ? 1 : -1) * Math.abs(f) ** F * q * zzfxV * (a < e ? a / e : a < e + m ? 1 - (a - e) / m * (1 - y) : a < e + m + t ? y : a < h - d ? (h - a - d) / u * y : 0), f = d ? f / 2 + (d > a ? 0 : (a < h - d ? 1 : (h - a) / d) * Z[a - d | 0] / 2) : f), p = (c += v += z) * Math.sin(E * x - I), g += p - p * B * (1 - 1E9 * (Math.sin(a) + 1) % 2), E += p - p * B * (1 - 1E9 * (Math.sin(a) ** 2 + 1) % 2), n && ++n > A && (c += w, D += w, n = 0), !l || ++J % l || (c = D, v = H, n = n || 1); return Z; };
// zzfxV - global volume
const zzfxV = .3;
// zzfxR - global sample rate
const zzfxR = 44100;
// zzfxX - the common audio context
const zzfxX = new window.AudioContext;
const audioContext = new AudioContext();