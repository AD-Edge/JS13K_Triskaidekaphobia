/////////////////////////////////////////////////////
// Opponent NPC Entity Class
/////////////////////////////////////////////////////
class npc {
    constructor(id) {
        this.id = id;

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
}