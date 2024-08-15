class card {
    constructor(numID, pos, type) {
        this.numID = numID;
        this.pos = pos;
        this.type = type;

        this.image = new Image();
        // this.image.src = './img/card_temp_' + this.typeID + '.png';
        this.image.src = './img/mNUL.png';
    }
    
    render(cx, w, h) {
        if(this.type == null) {
            context.drawImage(this.image, w * 0.5, h * 0.5, w/10, w/10);
        }
    }
}

export default card;