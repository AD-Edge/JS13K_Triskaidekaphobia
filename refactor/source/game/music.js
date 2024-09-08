/////////////////////////////////////////////////////
// Music Attempt god help me
/////////////////////////////////////////////////////

// 600 milliseconds - 100 BPM
let bpm = 180;
let bInterval = (60/bpm) * 1000;
let lastBeat = 0;

// Instruments 
// Music 198 - 'Almost Piano'
let aP = [.2,0,73.41619,.08,.2,.16,,1.4,,,,,,.2,,.1,,.1,.04,.39,257];

function musicTick(timestamp) {
    // Music 198 'Almost Piano'
    const elapsed = timestamp - lastBeat;
    if(elapsed >= bInterval) {
        playInst(aP);
        lastBeat = timestamp;
    }

}

function playInst(inst) {
    zzfx(...aP); 
}