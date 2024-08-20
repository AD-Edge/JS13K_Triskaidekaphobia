/////////////////////////////////////////////////////
// Card Entity Class
/////////////////////////////////////////////////////
import { lerp } from './math.js';
import { spriteMinis } from './graphics.js';

class card {
    constructor(cardID, pos, slotPos, type, rank) {
        this.cardID = cardID;
        this.pos = {
            x: pos.x,
            y: pos.y
        };
        this.slotPos = {
            x: slotPos.x,
            y: slotPos.y
        };
        // Assign Type from RNG
        if(type != null) {
            if(type == 1) {
                this.type = 'SPD';
            } else if (type == 2) {
                this.type = 'HRT';
            } else if (type == 3) {
                this.type = 'DMD';
            } else if (type == 4) {
                this.type = 'CLB';
            } else if (type == 0) {
                //deck sprite
                this.type = 'DCK';
            }
        }
        // Set Card Side (flopped or not)
        if(this.cardID == 'B') {
            this.cardFlipped = true;
        } else {
            this.cardFlipped = false;
        }

        // Handle Special Rank(s)
        if(rank == 1) {
            this.rank = 'A';
        } else {
            this.rank = rank;
        }
        // Setup images
        this.image = new Image();
        this.heldImage = new Image();
        // this.image.src = './img/card_temp_' + this.typeID + '.png';
        this.setIMG();
        this.heldImage.src = './img/mHOV.png';
        // other variables
        this.isHovered = false;
        this.isHeld = false;
        this.isSettled = false;

        //tollerence for position checks
        this.eps = 0.0001; 
        // debug card on generation
        this.printCard();
    }
    
    // Render Card
    render(ctx, w, h) {
        // Toggle card image if card is held
        const img = this.isHeld ? this.heldImage : this.image;

        if(!this.isSettled) {
            this.checkPos();
        }

        // Render card
        // Shadow first 
        if(this.isHeld) {
            ctx.fillStyle = '#00000033';
            ctx.fillRect((w*this.pos.x)-12, (h * this.pos.y)+7, h/8, w/9);
            ctx.fillRect((w*this.pos.x)-6, (h * this.pos.y)+2, h/10, w/8);
        }
        // Flip card if player B
        if(this.cardID == 'B') {
            ctx.save();
            ctx.scale(1, -1);
            ctx.translate(0, -ctx.canvas.height);
            ctx.drawImage(img, w * this.pos.x, h - this.pos.y * h - w/10, h/10, w/10);
            ctx.restore();
        } else {
            if(this.type == 'DCK') {
                ctx.drawImage(img, w * this.pos.x - 8, h * this.pos.y - 12, h/7.5, w/7.5);
            }
            else if(this.isHeld) {
                ctx.drawImage(img, w * this.pos.x, h * this.pos.y, h/9, w/9);
            } else {
                ctx.drawImage(img, w * this.pos.x, h * this.pos.y, h/10, w/10);
            }
        }

        if(this.isHovered) {
            ctx.fillStyle = '#0000BB80';
            if(this.isHeld) {
                ctx.fillStyle = '#FFFFFF40';
            }
            ctx.fillRect(w*this.pos.x, h * this.pos.y, h/10, w/10);
        } else {
            // ctx.fillStyle = '#FFFFFF00';
        }

        // Render rank text 
        if(!this.cardFlipped && this.type != 'DCK' && !this.isHeld) {
            ctx.font = "normal bolder 12px monospace";
            if(this.type == 'DMD' || this.type == 'HRT') {
                ctx.fillStyle = '#990000';
            } else {
                ctx.fillStyle = '#000000';
            }
            ctx.fillText(this.rank, (this.pos.x+0.0122)*w, (this.pos.y+0.032)*h);
        }

    }
    checkPos() {
        let startPos = { x: this.pos.x, y: this.pos.y };
        let targetPos = { x: this.slotPos.x, y: this.slotPos.y };
        let xOk = false;
        let yOk = false;

        if (Math.abs(startPos.x - targetPos.x) > this.eps) {
            this.pos.x = lerp(startPos.x, targetPos.x, 0.2);
        } else {
            xOk = true;
        }
        if (Math.abs(startPos.y - targetPos.y) > this.eps) {
            this.pos.y = lerp(startPos.y, targetPos.y, 0.1);
        } else {
            yOk = true;
        }

        // is this card settled in the target location? 
        if (xOk) {
            this.isSettled = true;
            // console.log("SETTLED");
        }    
    }

    // Check Bounding box for hover
    // If hovered and held, follow mouse location
    checkHover(mX, mY, w, h) {
        const width = h/9;
        const height = w/9;
        // console.log("checking hover");
        if(this.isHeld) {
            this.pos.x = (mX/w)-(width/w/2);
            this.pos.y = (mY/h)-(height/h/2);
        }
        return (mX >= w*this.pos.x && mX <= (w*this.pos.x) + width 
        && mY >= h*this.pos.y && mY <= (h*this.pos.y) + height);
    }
    // Check on click event 
    checkClick(clk) {
        if(clk) {
            if(this.isHovered) {
                this.isHeld = true;
                return true;
            }
        } else {
            this.isHeld = false;
            return false;
        }
        // console.log("click: " + clk);
    }
    // Set Image SRC
    setIMG() {
        if(this.type == 'SPD') {
            this.image.src = './img/mSPD.png';
        } else if (this.type == 'HRT') {
            this.image.src = './img/mHRT.png';
        } else if (this.type == 'DMD') {
            // this.image.src = './img/mDMD.png';
            this.image = spriteMinis[0];
        } else if (this.type == 'CLB') {
            this.image.src = './img/mCLB.png';
        } else if (this.type == 'DCK') {
            this.image.src = './img/mDCK.png';
        } else {
            this.image.src = './img/mNUL.png';
        }
        //override for flipped card
        if(this.cardFlipped) {
            this.image.src = './img/mBCK.png';
        }
    }
    flipCard() {
        this.cardFlipped = true;
        this.image.src = './img/mBCK.png';
    }
    setSlotPos(pos) {
        this.slotPos.x = pos.x;
        this.slotPos.y = pos.y;
    }
    // Debug print card info
    printCard() {
        console.log("Generated Card: " + this.rank + " of " + this.type + "s");
    }
    getRank() {
        if(this.rank == undefined) {
            return '??';
        }
        // console.log("RANK: " + this.rank);
        return this.rank;
    }
    getSuit() {
        if(this.type == 'BCK') {
            return '??';
        }
        // console.log("SUIT: " + this.type);
        return this.type;
    }
}

export default card;