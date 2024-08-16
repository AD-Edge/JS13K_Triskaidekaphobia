/////////////////////////////////////////////////////
// Debug Functions
/////////////////////////////////////////////////////

function debugArray(array) {
    const debugDiv = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = `DEBUG [PLAYER A]`;
    debugDiv.appendChild(title);

    array.forEach((slot, index) => {
        const slotP = document.createElement('p');
        
        // Set the text content of the paragraph to display the slot value
        // slotP.textContent = `Slot ${index + 1}: ${slot}`;
        // slotP.textContent = slot.getSuit().toString();
        if(slot != null) {
            console.log(slot.getSuit());
            slotP.textContent = `Slot ${index + 1}: ${slot.getRank()} of ${slot.getSuit()}s`;
        } else {
            slotP.textContent = `Slot ${index + 1}: ${slot}`;
        }

        // Append the paragraph to the container div
        debugDiv.appendChild(slotP);
    });

    debugDiv.classList.add("debugList");
    return debugDiv;
}

export { debugArray };