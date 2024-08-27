/////////////////////////////////////////////////////
// Debug Functions
/////////////////////////////////////////////////////

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

export { debugArray };