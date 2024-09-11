/////////////////////////////////////////////////////
// Round State Management Object
/////////////////////////////////////////////////////

class state_round {
    constructor(rID, score, diff, char) {
        this.rID = rID, this.score = score, this.diff = diff, this.char = char;

        this.completed = false;
    }
    // Reset round
    reset() {
    }
    // Called when round is finished
    roundEnd(win) {
    }
    // Retrieve this round score
    getScore(){
    }
}