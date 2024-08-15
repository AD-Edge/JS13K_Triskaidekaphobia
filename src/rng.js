/////////////////////////////////////////////////////
// Random Generation Functions
/////////////////////////////////////////////////////

function calcPerlin(x, y) {
    if (memory.hasOwnProperty([x,y]))
    return memory[[x,y]];

    let xf = Math.floor(x);
    let yf = Math.floor(y);
    //interpolate
    let tl = dotProductGrid(x, y, xf,   yf);
    let tr = dotProductGrid(x, y, xf+1, yf);
    let bl = dotProductGrid(x, y, xf,   yf+1);
    let br = dotProductGrid(x, y, xf+1, yf+1);
    let xt = interpret(x-xf, tl, tr);
    let xb = interpret(x-xf, bl, br);
    let v = interpret(y-yf, xt, xb);
    memory[[x,y]] = v;

    return v;
}

function randomVector() {
    //var theta = Math.random() * 2 * Math.PI;
    var theta = generateFloat(rng) * 2 * Math.PI;
    return {
        x: Math.cos(theta),
        y: Math.sin(theta)
    };
}

function dotProductGrid(x, y, vx, vy, seed){
    let g_vect;
    let d_vect = {x: x - vx, y: y - vy};
    if (gradients[[vx,vy]]){
        g_vect = gradients[[vx,vy]];
    } else {
        g_vect = randomVector(seed);
        gradients[[vx, vy]] = g_vect;
    }
    return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
}

function smoothStep(x) {
    return 6*x**5 - 15*x**4 + 10*x**3;
}

function interpret(x, a, b) {
    return a + smoothStep(x) * (b-a);
}

// // Generate a boolean with 30% success
// console.log(generateBoolean(rng, 0.5)); 
// console.log(generateBoolean(rng, 0.5)); 
// console.log(generateBoolean(rng, 0.5)); 
// console.log(generateBoolean(rng, 0.5)); 
// console.log(generateBoolean(rng, 0.5)); 
// console.log(generateBoolean(rng, 0.5)); 
// console.log(generateBoolean(rng, 0.5)); 
// console.log(generateBoolean(rng, 0.5)); 

// // Generate a D6
// console.log(generateNumber(rng, 1, 6)); // 3
// console.log(generateNumber(rng, 1, 6)); // 5
// console.log(generateNumber(rng, 1, 6)); // 5

// // Generate a float between 0 and 1
// console.log(generateFloat(rng)); 
// console.log(generateFloat(rng)); 

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

export { createNumberGenerator, createSeedFromString, generateNumber };