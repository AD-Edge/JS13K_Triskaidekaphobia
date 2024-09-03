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