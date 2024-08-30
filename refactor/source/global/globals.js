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
