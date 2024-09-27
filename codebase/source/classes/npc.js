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
    }

    // Get random text from opponent
    getRandomTxt(num) {
        let str, arr;
        if(this.lvl==1) {
            if(num == 0)        {arr = l1;
            } else if(num == 1) {arr = l2;
            } else if(num == 2) {arr = l3;
            } else if(num == 3) {arr = l4; }
        } else if (this.lvl==2) {
            if(num == 0)        {arr = m1;
            } else if(num == 1) {arr = m2;
            } else if(num == 2) {arr = m3;
            } else if(num == 3) {arr = m4; }
        } else if (this.lvl==3) {
            if(num == 0)        {arr = o1;
            } else if(num == 1) {arr = o2;
            } else if(num == 2) {arr = o3;
            } else if(num == 3) {arr = o4; }
        } else if (this.lvl==4) {
            if(num == 0)        {arr = o1;
            } else if(num == 1) {arr = o2;
            } else if(num == 2) {arr = o3;
            } else if(num == 3) {arr = o4; }
        }
        let r = generateNumber(rng, 0, arr.length-1);
        str = arr[r];
        console.log("NPC Text retrieved: " + str);
        return str;
    }

    makeMove() {
        let choice = 0;
        let eva = false;
        // Is it the final turn
        if(turn == turnMax) {
            console.log("Final turn - Opponent decides on move: Deal card to table");
            choice = 1;
        } else { // Any given turn
            if(this.lvl == 1) {
                choice = generateNumber(rng, 0, 4);
            } else if (this.lvl == 2) {
                choice = generateNumber(rng, 0, 3);
            } else {
                choice = generateNumber(rng, 0, 2);
            }

            let bestHand = 'tbd';
            if(oBest == 1) {
                bestHand = 'High card';
            } else if (oBest == 2) {
                bestHand = 'Pair';
            } else if (oBest == 3) {
                bestHand = 'Two pair';
            } else if (oBest == 4) {
                bestHand = 'Three of a kind';
            } else if (oBest == 5) {
                bestHand = 'Straight';
            } else if (oBest == 6) {
                bestHand = 'Flush';
            } else if (oBest == 7) {
                bestHand = 'Full house';
            } else if (oBest == 8) {
                bestHand = 'Four of a kind';
            } else if (oBest == 9) {
                bestHand = 'Straight Flush';
            } else if (oBest == 10) {
                bestHand = 'Royal Flush';
            }
            console.log("Opponent checks best hand, currently: " + bestHand + ' ' + oBest);

            //aggression
            let aggres = turn;
            //intelligence
            let int = this.lvl;

            //if high card, low int, deal card to table 
            //could base it on score of current 'best'
            //game & opponent level determine what the current NPC determines to be 'worth it'

            //if pair, % to either wait or play hand 
            //based on level (ie hands in game) 
            //chance of discard/abandon (based on level)
            
            //if two pair, % to either wait or play hand 
            //based on level (ie hands in game) 
            //chance of discard/abandon (based on level)

            //check higher hand probabilities

            //if last turn, play best current hand 


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

    getID() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getLvl() {
        return this.lvl;
    }
    getHand() {
        return this.hand;
    }
}