class card {
    constructor(numID, pos, type) {
        this.numID = numID;
        this.pos = {
            x: pos.x,
            y: pos.y
        };
        this.type = type;

        this.image = new Image();
        this.hoverImage = new Image();
        // this.image.src = './img/card_temp_' + this.typeID + '.png';
        this.image.src = './img/mNUL.png';
        this.hoverImage.src = './img/mHOV.png';
        
        this.isHovered = false;
        this.isHeld = false;
    }
    
    render(cx, w, h) {
        const img = this.isHeld ? this.hoverImage : this.image;

        if(this.type == null) {
            cx.drawImage(img, w * this.pos.x, h * this.pos.y, h/10, w/10);
        }

        if(this.isHovered) {
            cx.fillStyle = '#FF000080';
            cx.fillRect(w*this.pos.x, h * this.pos.y, h/10, w/10);
        } else {
            // cx.fillStyle = '#FFFFFF00';
        }

    }

    //Bounding box check for hover
    checkHover(mX, mY, w, h) {
        const width = h/10;
        const height = w/10;
        
        console.log("checking hover");
        if(this.isHeld) {
            this.pos.x = (mX/w)-(width/w/2);
            this.pos.y = (mY/h)-(height/h/2);
        }

        return (mX >= w*this.pos.x && mX <= (w*this.pos.x) + width 
        && mY >= h*this.pos.y && mY <= (h*this.pos.y) + height);
    }

    checkClick(clk) {
        if(clk) {
            if(this.isHovered) {
                this.isHeld = true;
            }
        } else {
            this.isHeld = false;
        }
        console.log("click: " + clk);
    }

}

export default card;