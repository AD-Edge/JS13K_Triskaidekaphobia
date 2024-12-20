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
        console.log("//////////////////// Opponent Choice CALC-START");
        let choice = [];
        let eva = false;
        
        // what is the current best hand
        let bestHand = getBestHandB();
        
        let cardSummary = oBest[1];

        if(oBest.length > 2) {
            console.log("Opponent checks best hand, currently: " + bestHand + ", with cards [" + cardSummary + ']');
        } else {
            console.log("Opponent checks best hand, currently: " + bestHand + ", with card [" + cardSummary + ']');
        }
        
        // Check if it is the final turn
        if(turn == turnMax) {
            console.log("Opponent's final turn - Play best hand if not currently played");
            
            //work out best current hand

            //add in error amount, for lower intelligence
            //maybe just a chance of choosing a card at random, which decreases with level

            //for now, just return simple play card, no indexes
            choice[0] = 1;

        } else { // Any given turn choices
            // Random choice gen based on level
            // 0 = nothing
            // 1 = deal card(s)
            // 2 = discard 
            // 3 = evaluate hand (predict)
            if(this.lvl == 1) { // most basic level of opponent
                choice[0] = generateNumber(rng, 0, 2);
            } else if (this.lvl == 2) { // similar basic, but more aggressive
                choice[0] = generateNumber(rng, 0, 2);
            } else if (this.lvl == 3) { // added option of basic evaluation
                choice[0] = generateNumber(rng, 0, 3);
            } else if (this.lvl >= 4) { // basic evaluation, and more aggressive
                choice[0] = generateNumber(rng, 1, 3);
            }

            // Aggression
            let agr = turn;
            // Intelligence
            let int = this.lvl;
            // Positions to work with
            let emptySlots = 0;
            for(let i=0; i < tableCardHoldB.length; i++) {
                if(tableCardHoldB[i] == null) {
                    emptySlots++;
                }
            }
            //add on slots which dont exist yet too
            if(tableCardHoldB.length < handSize) {
                emptySlots += handSize - tableCardHoldB.length;
            }
            console.log("Opponent has " + emptySlots + " empty slots left to work with, out of " + handSize + " hand size.");
            
            //if high card, chance to deal to table if low int 
            //could base it on score of current 'best' ?
            //game & opponent level determine what the current NPC determines to be 'worth it'
            if(oBest[0] == 1 && choice[0] == 1) {
                console.log("High card is current best ... deciding what to do");
                // get card score
                let oBestScore = 0;
                let oBestThreshold = 0;
                // is it over the threshold ? 
                // lower level will rank lower cards higher
            }
            console.log("Highest card of play: " + oHigh);
            
            //choose to either play that hand right away, or try to make a better hand
            //preserve best hand while trying to make better hand ? (if possible)
            //in the event of a flush attempt, best hand might not be able to be kept (needs all 5)

            //if pair, % to either wait or play hand 
            //based on level (ie hands in game) 
            //chance of discard/abandon (based on level)
            
            //if two pair, % to either wait or play hand 
            //based on level (ie hands in game) 
            //chance of discard/abandon (based on level)
            
            //check higher hand probabilities
            
            //if last turn, play best current hand 
            
            if(choice[0] == 0) { // Nothing
                console.log("//////////////////// Opponent move DECISION: Nothing/Wait");
                //dumb move, low int only
            } else if (choice[0] == 1) { // Deal out card
                console.log("//////////////////// Opponent move DECISION: Try to deal 'good' card(s) to table");
                //return choice, and index of card(s) to deal out
                //full 'best' current hand? 

            } else { // Discard
                console.log("//////////////////// Opponent move DECISION: Discard card of low value/importance");
                let disNum = generateNumber(rng, 1, 2);
                console.log("//////////////////// Opponent DISCARD: " + disNum + " cards");
                
                // find lowest value cards (which arent marked)
                let rNum = generateNumber(rng, 1, handSize);
                let lowInd = getLowestCards(rNum, tableCardHoldB);
                console.log("//////////////////// LOWEST INDEX TO DISCARD: " + lowInd + " for " + rNum + " cards");


                // set threshold for what a 'good' rank is 

                // anythign under that is good to discard 

                // discard an amount based on aggression and max hand size

                //return choice, and index of card(s) to discard

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