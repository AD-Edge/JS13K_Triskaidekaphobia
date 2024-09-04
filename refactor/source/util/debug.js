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

function debugArray(array, index) {
    const debugDiv = document.createElement('div');
    const title = document.createElement('h2');
    if(index == 0) {
        title.innerHTML = `&nbsp;DEBUG<br>[TABLE A]`;
    } else if(index == 1) {
        title.innerHTML = `&nbsp;DEBUG<br>[PLAYER A]`;
    } else if(index == 2) {
        title.innerHTML = `&nbsp;DEBUG<br>[OPPONENT B]`;
    } else if(index == 3) {
        title.innerHTML = `&nbsp;DEBUG<br>[GEN QUEUE]`;    
    } else if(index == 4) {
        title.innerHTML = `&nbsp;DEBUG<br>[TABLE B]`;    
    } else if(index == 5) {
        title.innerHTML = `&nbsp;DEBUG<br>[DISCARD]`;    
    }
    debugDiv.appendChild(title);

    if(array.length == 0) {
        const slotE = document.createElement('p');
        slotE.textContent = `[Empty]`;
        debugDiv.appendChild(slotE);
    } else {
        array.forEach((slot, index) => {
            const slotP = document.createElement('p');
            
            // Set the text content of the paragraph to display the slot value
            // slotP.textContent = `Slot ${index + 1}: ${slot}`;
            // slotP.textContent = slot.getSuit().toString();
            
            if(slot != null) {
                // console.log(slot.getSuit());
                slotP.textContent = `Slot${index + 1}: ${slot.getRank()} of ${slot.getSuit()}s`;
            } else {
                slotP.textContent = `Slot${index + 1}: ${slot}`;
            }
            // slotP.textContent = `element`;
    
            // Append the paragraph to the container div
            debugDiv.appendChild(slotP);
        });
    }

    // console.log("DEBUG UPDATE FOR INDEX: " + index);

    debugDiv.classList.add("debugList");
    return debugDiv;
}


function genDebugArray(array, index) {
    // let debugElement = document.querySelector('.debugList');
    if(index == 0) { // table A
        let debugElement0 = document.getElementById('debug0');
    
        if (debugElement0) {
            debugElement0.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug0";
        document.body.appendChild(dbg);
    } else if(index == 1) { // player A
        let debugElement1 = document.getElementById('debug1');
    
        if (debugElement1) {
            debugElement1.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug1";
        document.body.appendChild(dbg);
    } else if (index == 2) { // opponent b
        let debugElement2 = document.getElementById('debug2');
    
        if (debugElement2) {
            debugElement2.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug2";
        document.body.appendChild(dbg);
    } else if (index == 3) { // queue in
        let debugElement3 = document.getElementById('debug3');
    
        if (debugElement3) {
            debugElement3.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug3";
        document.body.appendChild(dbg);
    } else if (index == 4) { // table B
        let debugElement4 = document.getElementById('debug4');
    
        if (debugElement4) {
            debugElement4.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug4";
        document.body.appendChild(dbg);
    } else if (index == 5) { // dscQueue
        let debugElement5 = document.getElementById('debug5');
    
        if (debugElement5) {
            debugElement5.remove();
        }
        let dbg = debugArray(array, index);
        dbg.id = "debug5";
        document.body.appendChild(dbg);
    }
}

function recalcDebugArrays() {
    genDebugArray(playerCardHand, 0);
    // genDebugArray(tableCardHoldA, 0);

    // genDebugArray(playerCardHand, 1);
    // genDebugArray(opponentCardHand, 2);
    // genDebugArray(cardGenQueueA, 3);
    // genDebugArray(tableCardHoldB, 4);
    // genDebugArray(dscQueue, 5);
    // genDebugArray(cardGenQueueB, 4);
}