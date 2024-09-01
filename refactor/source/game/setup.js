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
        for (let i = titleCds.length; i >= 0; i--) {
            if(titleCds[i] != null && currentHover != null) {
                var click = titleCds[i].checkClick(true);
                if(click) {
                    currentHeld = [titleCds[i], 0];
                    return;
                }
            }
        }
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

    //reset
    rect = cvs.getBoundingClientRect();

    console.log("cvs Inner Resolution: " + cvs.width + "x" + cvs.height);
    console.log("cvs Width/Height: " + cvs.style.width + " x " + cvs.style.height);
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
                            playerCardHand[0] = new card('A', deckPos, deckPos, generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));
                            
                            titleCds[0] = new card('A', deckPos, deckPos, generateNumber(rng, 1, 4), generateNumber(rng, 1, 10));
                        }, 800);
            
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
        new uix(2, 0.06, 0.50, 0.15, 0.1, '#2AF', 'START', null), // 1
        new uix(2, 0.06, 0.62, 0.20, 0.08, '#2AF', 'OPTIONS', null), // 2
        new uix(2, 0.06, 0.72, 0.20, 0.08, '#2AF', 'CREDITS', null), // 3
        new uix(2, 0.05, 0.88, 0.17, 0.08, '#F42', 'BACK', null), // 4
        new uix(2, 0.81, 0.27, 0.16, 0.11, '#6F6', 'CONT', null), // 5
        new uix(2, 0.80, 0.735, 0.16, 0.11, '#6F6', 'NEXT', null), // 6
        new uix(2, 0.28, 0.65, 0.23, 0.06, '#2AF', 'REPLAY', null), // 7
        new uix(2, 0.56, 0.65, 0.15, 0.06, '#FA2', 'EXIT', null), // 8
        new uix(2, 0.06, 0.85, 0.39, 0.06, '#FAA', 'CONNECT WALLET', null), // 9
    ];
    uiT = [
        new uix(1, 0.22, 0.1, 3.5, 0, null, 'JS13K TITLE', null),
        new uix(1, 0.05, 0.5, 1.5, 0, null, 'DSC', null),
        new uix(1, 0.35, 0.2, 2, 0, null, 'OPTIONS', null),
        new uix(1, 0.35, 0.2, 2, 0, null, 'CREDITS', null),
        new uix(1, 0.23, 0.60, 1, 0, null, 'A GAME BY ALEX DELDERFILED', null),
        new uix(1, 0.33, 0.65, 1, 0, null, 'FOR JS13K 2O24', null),
        new uix(1, 0.25, 0.45, 2, 0, null, 'END OF ROUND', null), // 6
        new uix(1, 0.27, 0.55, 2, 0, null, 'PLAYER WINS', null), // 7
        new uix(1, 0.31, 0.55, 2, 0, null, 'GAME OVER', null), // 8
    ];
    uiS = [
        // ix, x, y, dx, dy, c, str, img
        new uix(0, 0.42, 0.858, 0.04, 0.04, null, '', sprS[0]), // AVAX sprite
        
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
    gl = canvas3d.getContext("webgl2");
    console.log("GL: " + gl);
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
                float v=1.0-pow(d.x,20.0)-pow(d.y,20.0);
                float l=1.0-pow(d.x,4.0)-pow(d.y,4.0);
                c*=(0.5+0.6*l)*step(0.1,v)*(0.9+0.15*abs(sin(a.y*2.14*${screenHeight}.0)));
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

}