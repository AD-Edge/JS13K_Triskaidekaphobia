/////////////////////////////////////////////////////
// Card Entity Class
/////////////////////////////////////////////////////

class card {
    constructor(numID, pos, type, rank) {
        this.numID = numID;
        this.pos = {
            x: pos.x,
            y: pos.y
        };
        this.type = type;
        this.rank = rank;

        this.image = new Image();
        this.hoverImage = new Image();
        // this.image.src = './img/card_temp_' + this.typeID + '.png';
        // this.image.src = './img/mNUL.png';
        this.setIMG();
        this.hoverImage.src = './img/mHOV.png';
        
        this.isHovered = false;
        this.isHeld = false;

        console.log("Generated Card: " + this.rank + " of " + this.type + "s");
    }
    
    render(ctx, w, h) {
        const img = this.isHeld ? this.hoverImage : this.image;

        ctx.drawImage(img, w * this.pos.x, h * this.pos.y, h/10, w/10);

        if(this.isHovered) {
            ctx.fillStyle = '#0000BB80';
            if(this.isHeld) {
                ctx.fillStyle = '#FFFFFF40';
            }
            ctx.fillRect(w*this.pos.x, h * this.pos.y, h/10, w/10);
        } else {
            // ctx.fillStyle = '#FFFFFF00';
        }

        if(this.type != 'BCK') {
            ctx.font = "normal bolder 12px monospace";
            if(this.type == 'DMD' || this.type == 'HRT') {
                ctx.fillStyle = '#990000';
            } else {
                ctx.fillStyle = '#000000';
            }
            ctx.fillText(this.rank, (this.pos.x+0.0122)*w, (this.pos.y+0.032)*h);
        }

    }

    //Bounding box check for hover
    checkHover(mX, mY, w, h) {
        const width = h/10;
        const height = w/10;
        
        // console.log("checking hover");
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
        // console.log("click: " + clk);
    }

    setIMG() {
        if(this.type == 'SPD') {
            this.image.src = './img/mSPD.png';
        } else if (this.type == 'HRT') {
            this.image.src = './img/mHRT.png';
        } else if (this.type == 'DMD') {
            this.image.src = './img/mDMD.png';
        } else if (this.type == 'CLB') {
            this.image.src = './img/mCLB.png';
        } else if (this.type == 'BCK') {
            this.image.src = './img/mBCK.png';
        } else {
            this.image.src = './img/mNUL.png';
        }
    }

}

export default card;