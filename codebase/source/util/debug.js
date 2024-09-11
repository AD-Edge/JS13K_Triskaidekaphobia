/////////////////////////////////////////////////////
// Debug Functions
/////////////////////////////////////////////////////

function debugMouse() {
    drawB((mouseX/w)-0.01, (mouseY/h)-0.02, 0.02, 0.04, '#22AAFF50');
}

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

var op = document.getElementById('o');
var op1 = document.getElementById('o1');
var op2 = document.getElementById('o2');
var op3 = document.getElementById('o3');
var op4 = document.getElementById('o4');

function recalcStats() {
    // High Card
    let topC = getTopCard(opponentCardHand);
    // const slotO1 = document.createElement('p');
    op1.textContent = `high: ${opponentCardHand[topC[0]].getRank()} of ${opponentCardHand[topC[0]].getSuit()}`;
    op1.style.color = '#2F2';
    
    // Pair
    let pairC = lookForPair(opponentCardHand, tableCardHoldB);
    if(pairC != -1) {
        op2.textContent = `pair:  ${cardOrder[pairC]}'s `;
        
        op1.style.color = '#F22';
        op2.style.color = '#2F2';
    }else {
        op2.textContent = `pair: N/A`;
        op2.style.color = '#F22';
    }

    // Two pair
    let pairT = lookForTwoPair(opponentCardHand, tableCardHoldB);
    if(pairT[0] != -1) {
        op3.textContent = `two pair:  ${cardOrder[pairT]}'s `;
        
        op1.style.color = '#F22';
        op2.style.color = '#F22';
        op3.style.color = '#2F2';
    }else {
        op3.textContent = `two pair: N/A`;
        op3.style.color = '#F22';
    }
    // Three of a kind
    let three = lookForThree(opponentCardHand, tableCardHoldB);
    if(three != -1) {
        op4.textContent = `three oak:  ${cardOrder[three]}'s `;
        
        op1.style.color = '#F22';
        op2.style.color = '#F22';
        op3.style.color = '#F22';
        op4.style.color = '#2F2';
    }else {
        op4.textContent = `three oak: N/A`;
        op4.style.color = '#F22';
    }

}

function recalcDebugArrays() {
    genDebugArray(tableCardHoldA, 0);
    genDebugArray(playerCardHand, 1);
    genDebugArray(opponentCardHand, 2);
    genDebugArray(cardGenQueueA, 3);
    genDebugArray(tableCardHoldB, 4);
    genDebugArray(dscQueue, 5);
}