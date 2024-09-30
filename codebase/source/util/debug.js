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
        debugDiv.style.right = '80px';    
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
        debugDiv.style.right = '300px';
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

function recalcStats(id) {
    const op0 = document.createElement('p'); // NPC
    const op1 = document.createElement('p'); // High Card
    const op2 = document.createElement('p'); // Pair
    const op3 = document.createElement('p'); // Two Pair
    const op4 = document.createElement('p'); // Three of a Kind
    const op5 = document.createElement('p'); // Straight
    const op6 = document.createElement('p'); // Flush
    const op7 = document.createElement('p'); // Full House
    const op8 = document.createElement('p'); // Four of a Kind
    // const op9 = document.createElement('p'); // Straight Flush
    // const op10 = document.createElement('p'); // Royal Flush
    var newDiv = null;

    //recalc (in calc.js)
    if(id == 'A') {
        calcsCards(playerCardHand, tableCardHoldA, 'A');
        
        let dnew = document.getElementById('newDivA');
        if (dnew) { dnew.remove(); }

        newDiv = document.createElement('div');
        newDiv.id = "newDivA";
        const title = document.createElement('h2');
        newDiv.classList.add("debugList");
        newDiv.appendChild(title);
        
        title.innerHTML = `&nbsp;Player CALC <BR>&nbsp;(all)`;

        op0.style.color = '#88F';
        op0.textContent = `Player: 0x..0000, Game: ${game}`;
        newDiv.appendChild(op0);

        // Duplicates
        if(pHigh != -1) {
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
        // oDups[ [rank, count, index] , [rank, count, index] .... ]
        for(let i = 0; i < oDups.length; i++) {
            if(pDups[i][1] == 2) { // Pair

                pBest = [2,null];
                op2.style.color = '#5F5';
                op2.textContent += ` ${cardOrder[pDups[i][0]]},`;    
            } else {
                op2.textContent = `pair: x`;                
            }
            if(pDups[i][1] == 3) { // Three of a kind
                pBest = [4,null];
                op4.style.color = '#5F5';
                op4.textContent += ` ${cardOrder[pDups[i][0]]},`;    
            } else {
                op4.textContent = `three of a kind: x`;                
            }
            if(pDups[i][1] == 4) { // Four of a kind
                pBest = [8,null];
                op8.style.color = '#5F5';
                op8.textContent += ` ${cardOrder[pDups[i][0]]},`;    
            } else {
                op8.textContent = `four of a kind: x`;                
            }
            
        }
    
        // High Card
        if(pHigh != -1) {
            pBest = [1, pHigh];
            op1.textContent = `high: ${pHigh}`;
            op1.style.color = '#5F5';
            
            // Two Pair
            if(pTwoP) {
                pBest = [3,null];
                op3.style.color = '#5F5';
                op3.textContent = `two pair: true`;
            } else {
                op3.style.color = '#55F';
                op3.textContent = `two pair: x`;
            }
            
            //Flush
            op6.textContent = `flush:`;
            op6.style.color = '#55F';
            if(pFlsh[3] >= 5) {
                pBest = [6,null];
                op6.style.color = '#5F5';
            }
            op6.textContent += ` SPD[${pFlsh[3]}],`;  
            if(pFlsh[2] >= 5) {
                op6.style.color = '#5F5';
            }
            op6.textContent += ` HRT[${pFlsh[2]}],`;  
            if(pFlsh[1] >= 5) {
                op6.style.color = '#5F5';
            }
            op6.textContent += ` DMD[${pFlsh[1]}],`;  
            if(pFlsh[0] >= 5) {
                op6.style.color = '#5F5';
            }
            op6.textContent += ` CLB[${pFlsh[0]}]`;
    
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
        newDiv.style.left = '200px';  
        // newDiv.style.top = '0px';    
        // newDiv.style.left = '195px';  
        newDiv.style.width = '250px';

    } else if (id == 'B') {
        calcsCards(opponentCardHand, tableCardHoldB, 'B');
        
        let dnew = document.getElementById('newDivB');
        if (dnew) { dnew.remove(); }

        newDiv = document.createElement('div');
        newDiv.id = "newDivB";
        const title = document.createElement('h2');
        newDiv.classList.add("debugList");
        newDiv.appendChild(title);

        title.innerHTML = `&nbsp;Opponent CALC <BR>&nbsp;(all)`;
        
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
        // oDups[ [rank, count, index] , [rank, count, index] .... ]
        for(let i = 0; i < oDups.length; i++) {
            if(oDups[i][1] == 2) { // Pair

                oBest = [2,null];
                op2.style.color = '#5F5';
                op2.textContent += ` ${cardOrder[oDups[i][0]]},`;    
            } else {
                op2.textContent = `pair: x`;                
            }
            if(oDups[i][1] == 3) { // Three of a kind
                oBest = [4,null];
                op4.style.color = '#5F5';
                op4.textContent += ` ${cardOrder[oDups[i][0]]},`;    
            } else {
                op4.textContent = `three of a kind: x`;                
            }
            if(oDups[i][1] == 4) { // Four of a kind
                oBest = [8,null];
                op8.style.color = '#5F5';
                op8.textContent += ` ${cardOrder[oDups[i][0]]},`;    
            } else {
                op8.textContent = `four of a kind: x`;                
            }
            
        }
    
        // High Card
        if(oHigh != -1) {
            oBest = [1, oHigh];
            op1.textContent = `high: ${oHigh}`;
            op1.style.color = '#5F5';
            
            // Two Pair
            if(oTwoP) {
                oBest = [3,null];
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
                oBest = [6,null];
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
    }

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