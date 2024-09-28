/////////////////////////////////////////////////////
// Card Entity Class
/////////////////////////////////////////////////////
class card {
    constructor(cdID, pos, slotPos, suit, rank, spd, flt) {
        this.cdID = cdID, this.flt = flt;
        this.pos = {
            x: pos.x,
            y: pos.y
        };
        this.slotPos = {
            x: slotPos.x,
            y: slotPos.y
        };
        // Assign suit/suit of card
        if(suit != null) { 
            if (suit < 4) { 
                this.suit = suitOrder[suit];
            } else {
                this.suit = 'DCK'; 
            }
        }
        // if(suit == 1) { this.suit = 'SPD'; } 
        // else if (suit == 2) { this.suit = 'HRT'; } 
        // else if (suit == 3) { this.suit = 'DMD'; } 
        // else if (suit == 4) { this.suit = 'CLB'; } 
        // Assign Rank
        if(rank < 9) { this.rank = rank+2; }
        if(rank == 9) { this.rank = 'J';}
        if(rank == 10) { this.rank = 'Q';}
        if(rank == 11) { this.rank = 'K';}
        if(rank == 12) { this.rank = 'A';}
        if(rank == 13) { this.rank = '13';}

        if(this.flt) { //scaler
            this.s = 0.8;
        } else {
            this.s = 1; 
        }
            // Set Card Side (flopped or not)
        this.flp = false;
        if(this.cdID == 'B') { this.flp = true; }
        if(this.cdID == 'T') { this.s = 2; }
        // Setup images
        this.image = new Image();
        this.hld = new Image();
        // index for rank string
        if(rank != null) { this.rk = strToIndex(this.rank) }
        else { this.rk = null }

        this.setIMG();
        this.hld = sprM[5];
        // other variables
        this.isHov = false;
        this.isHld = false;
        this.isSet = false;
        //tollerence for position checks
        this.eps = 0.02; 
        // debug card on generation
        // this.printCard();
        
        this.sX = h/10; // scaleX
        this.shr = true; // shrinking
        this.spd = (spd - this.pos.x)/1.8; // spin speed
        this.cspd = (spd - this.pos.x)/8; // move speed
        this.posi = 0; // spin speed
        this.inv = false;

        // 0 = no state
        // 1 = top card(s)
        this.state = 0; 
        this.points = getCardScore(this.rank, this.suit)*10;
    }
    
    // r Card
    render() {
        // Toggle card image if card is held
        // const img = this.isHld ? this.hld : this.image;
        const img = this.image;
        // If not set, lerp card location
        if(!this.isSet) { this.checkPos(); }
        // Spin Card
        if(this.sX != 0 && this.flt) { 
            this.sX += this.spd;
            this.posi += this.spd/2000;
            if(this.sX <= 0.3) {
                if(this.inv) {
                    this.setIMG();
                } else {
                    this.image = sprM[6];
                }
                this.inv = !this.inv;
                this.spd = -this.spd;
            } else if (this.sX > (h/10)+0.1) {
                this.spd = -this.spd;
            }
        } else { // regular card
            this.sX = h/10
        }
        // r card
        // Shadow first 
        if(this.isHld) {
            cx.fillStyle = '#00000035';
            cx.fillRect((w*(this.pos.x - this.posi))-12, (h * this.pos.y)+11, (this.sX*this.s*1.4), (w/9)*this.s);
        } else {
            cx.fillStyle = '#00000025';
            cx.fillRect((w*(this.pos.x - this.posi))-7, (h * this.pos.y)+7, (this.sX*this.s*1.3), (w/10)*this.s);
        }
        // Flip card
        if(this.flp) {
            cx.save();
            cx.scale(1, -1);
            cx.translate(0, -cx.canvas.height);
            cx.drawImage(img, w * this.pos.x, h - this.pos.y * h - w/10, (h/10)*this.s, (w/12)*this.s);
            cx.restore();
        } else {
            if(this.suit == 'DCK') { // Draw deck card
            cx.drawImage(img, w * this.pos.x - 6, h * this.pos.y - 12, h/6.5*this.s, w/9.5*this.s ); }
            else if(this.isHld) { // Draw held 
            cx.drawImage(img, w * (this.pos.x - this.posi), h * this.pos.y, this.sX*this.s/.7, (w/9)*this.s ); } 
            else { // Just Draw
            cx.drawImage(img, w * (this.pos.x - this.posi), h * this.pos.y, this.sX*this.s/.8, (w/10)*this.s ); }
        }

        if(this.isHov) { // Hover and held color
            if(this.isHld) { 
                // cx.fillStyle = '#FFFFFF20'; 
                // cx.fillRect(w*(this.pos.x - this.posi), h * this.pos.y, this.sX*this.s/.7, w/9);
            } else {
                cx.fillStyle = '#3333FF50';
                cx.fillRect(w*(this.pos.x - this.posi), h * this.pos.y, this.sX*this.s/.8, w/10*this.s);
            }
        }
        cx.globalAlpha = 1.0;

        //Float card movement
        if(this.flt && !this.isHld) {
            this.pos.y += this.cspd/100;
            if(this.pos.y < -0.5) {
                this.pos.y = generateNumber(rng, 1, 1.2);
                this.pos.x = generateNumber(rng, 0, 0.75);
            }
        }
        // r rank text 
        if(this.suit != 'DCK' && this.rk != null && this.flp != true) {
            // cx.font = "normal bolder 12px monospace";
            let ex=0;
            if(this.isHld){ex=0.004}
            if(this.suit == 'DMD' || this.suit == 'HRT') { 
                renderFont(this.pos.x+(ex+0.01*this.s), this.pos.y+(ex+0.019*this.s), w, h, this.s/.9, fntR, this.rk);
                // cx.fillStyle = '#900'; } 
            } else { 
                renderFont(this.pos.x+(ex+0.01*this.s), this.pos.y+(ex+0.019*this.s), w, h, this.s/.9, fntB, this.rk);
            }
            // cx.fillStyle = '#000'; }
            // cx.fillText(this.rank, (this.pos.x+0.0122)*w, (this.pos.y+0.032)*h);
        }
        //render score    
        if(this.suit != 'DCK' && this.rk != null && this.rank !=13) {
            let inv = -2;
            if(!this.flp) {
                inv = 1;
            }
            if(this.state == 0) {
                cx.fillStyle = '#5555AAAA';
            } else if (this.state == 1) {
                cx.fillStyle = '#55AA55CC';
            }
            cx.fillRect((w*(this.pos.x))+20, (h * this.pos.y)-(inv*25), (this.s*60), (w/50)*this.s);

            renderFont(this.pos.x+0.03, this.pos.y-(0.045*inv), w, h, this.s/.9, fntW, strToIndex(this.points));
        }

    }
    checkPos() {
        let strt = { x: this.pos.x, y: this.pos.y };
        let targ = { x: this.slotPos.x, y: this.slotPos.y };
        let xOk = false, yOk = false;

        if (Math.abs(strt.x - targ.x) > this.eps) {
            this.pos.x = lerp(strt.x, targ.x, 0.1);} 
        else { xOk = true; }
        if (Math.abs(strt.y - targ.y) > this.eps) {
            this.pos.y = lerp(strt.y, targ.y, 0.1); } 
        else { yOk = true; }
        // is this card settled in the target location? 
        // if (xOk && yOk) { this.isSet = true;
        //     console.log(this.rank + " SETTLED"); }
        if (xOk && yOk) {
            this.isSet = true;
            // zzfx(...[.6*mVo,,105,.03,.01,0,4,2.7,,75,,,,,,,.05,.1,.01,,-1254]); // card clack
            // console.log(this.rank + " SETTLED: " + this.pos.x + ", " + this.pos.y);
        }        
    }
    // Check Bounding box for isHover
    // If isHovered and held, follow mouse location
    checkHover(mX, mY) {
        let wC = h/9;
        let hC = w/9;
        // console.log("checking isHover: " + this.rank);
        if(this.isHld) {
            this.isSet = true;
            this.pos.x = (mX/w)-(wC/w/2);
            this.pos.y = (mY/h)-(hC/h/2);}

        return (mX >= w*this.pos.x && mX <= (w*this.pos.x) + wC 
        && mY >= h*this.pos.y && mY <= (h*this.pos.y) + hC);
    }
    // Check on click event 
    checkClick(clk) {
        if(clk) {
            if(this.isHov) { this.isSet = true; this.isHld = true; return true; }} 
        else { this.isHld = false; this.isSet = true; this.isHov = false; return false; }
    }
    resetOnDrop() {
        this.isHld = false, this.isHov = false;
    }
    // Set Image SRC
    setIMG() {
        if(this.suit == 'SPD') { this.image = sprM[0]; } 
        else if (this.suit == 'HRT') { this.image = sprM[2]; } 
        else if (this.suit == 'DMD') { this.image = sprM[3]; } 
        else if (this.suit == 'CLB') { this.image = sprM[1]; } 
        else if (this.suit == 'DCK') { this.image = sprM[7]; } 
        //override for flipped card
        else { this.image = sprM[4]; }
        if(this.flp) { this.image = sprM[6]; }
    }
    flipCard(val) {
        this.flp = val;
        this.setIMG();
    }
    setSlotPos(pos) {
        this.slotPos.x = pos.x;
        this.slotPos.y = pos.y;
    }
    setPos(pos) {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
    }
    setSettled(val) {
        this.isSet = val;
    }
    // Debug print card info
    printCard() {
        console.log("Gen Card: " + this.rank + " of " + this.suit + "s");
    }
    stateSwitch(s) {
        this.state = s;
    }
    getRank() {
        if(this.rank == undefined) { return '??'; }
        return this.rank;
    }
    getSuit() {
        if(this.suit == 'BCK') { return '??'; }
        return this.suit;
    }
    getPos() {
        return this.pos;
    }
    getSlotPos() {
        return this.slotPos;
    }
}