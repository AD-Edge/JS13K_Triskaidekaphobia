/////////////////////////////////////////////////////
// Opponent NPC Entity Class
/////////////////////////////////////////////////////
class npc {
    constructor(id, name, lvl, dial, hand) {
        this.id = id;
        this.name = name;
        this.lvl = lvl;
        this.dial = dial;
        this.hand = hand;

        this.handMake = 0; 
        // 0 = High card
        // 1 = Pair
        // 2 = Two Pair
        // 3 = Three of a kind 
        // 4 = Straight
        // 5 = Flush
        // 6 = Full House
        // 7 = Four of a Kind 
        // 8 = Straight Flush 
        // 9 = Royal Flush 
    }

    // Get random text from opponent
    getRandomTxt(num) {
        let str, arr;
        if(num == 0)        {arr = o1;
        } else if(num == 1) {arr = o2;
        } else if(num == 2) {arr = o3;
        } else if(num == 3) {arr = o4; }
        let r = generateNumber(rng, 0, arr.length-1);
        str = arr[r];

        console.log("Intro retrieved: " + str);
        return str;
    }

    makeMove() {
        let choice = 0;
        let eva = false;
        // Is it the final round
        if(round == roundMax) {
            console.log("Final round - Opponent decides on move: Deal card to table");
            choice = 1;
        } else { // Any given round
            choice = generateNumber(rng, 0, 2);
            // Evaluate
            // eva = generateBoolean(rng, .5);
            eva = true;
            console.log("Evaluation? " + eva);
            if(eva) {
                console.log("Opponent evaluates cards: ");
                this.evaluateHand();
                eva = false;
            }

            if(choice == 0) { // Nothing
                console.log("Opponent decides on move: Nothing");
            } else if (choice == 1) { // Deal out card
                console.log("Opponent decides on move: Deal card to table");
            } else { // Discard
                console.log("Opponent decides on move: Discard card");
            }
        }
        return choice;
    }

    evaluateHand() {
        console.log("////////////this.handMake: " + this.handMake);
        let pair = lookForPair(opponentCardHand, tableCardHoldB);
        console.log("////////////Pair found? " + pair);

    }
}