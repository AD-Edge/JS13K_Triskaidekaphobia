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
    }

    //get random text from opponent
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
        let choice = generateNumber(rng, 0, 3);

        if(choice == 0) { //discard
            console.log("Opponent decides on move: Discard card");
        } else if (choice == 1) { // deal out card
            console.log("Opponent decides on move: Deal card to table");
        } else { // nothing
            console.log("Opponent decides on move: Nothing");
        }

        return choice;
    }
}