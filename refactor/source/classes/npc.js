/////////////////////////////////////////////////////
// Opponent NPC Entity Class
/////////////////////////////////////////////////////
class npc {
    constructor(id) {
        this.id = id;

    }


    //get random text from opponent
    getRandomTxt(num) {
        let str = null;
        if(num == 0) {
            let arr = o1;
            let r = generateNumber(rng, 0, arr.length-1);
            str = arr[r];
        }
        console.log("Intro retrieved: " + str);
        return str;
    }
}