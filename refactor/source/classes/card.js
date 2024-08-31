/////////////////////////////////////////////////////
// Card Entity Class
/////////////////////////////////////////////////////
class card {
    constructor(cdID, pos, sP, suit, rank) {
        this.cdID = cdID, this.pos = pos, this.sP = sP;
        // Assign suit/suit of card
        if(suit != null) { 
            if(suit == 1) { this.suit = 'SPD'; } 
            else if (suit == 2) { this.suit = 'HRT'; } 
            else if (suit == 3) { this.suit = 'DMD'; } 
            else if (suit == 4) { this.suit = 'CLB'; } 
            else if (suit == 0) { this.suit = 'DCK'; }}
        // Set Card Side (flopped or not)
        this.flp = false;
        if(this.cdID == 'B') { this.flp = true; }
        // Handle Special Rank(s)
        this.rank = rank;
        if(rank == 1) { this.rank = 'A';}
        // Setup images
        this.image = this.hld = new Image();
        this.setIMG();
        this.hld = sprM[5];
        // other variables
        this.isHov = this.isHld = this.isSet = false;
        //tollerence for position checks
        this.eps = 0.0001; 
        // debug card on generation
        this.printCard();
    }
    
    // Render Card
    render() {
        // Toggle card image if card is held
        const img = this.isHld ? this.hld : this.image;
        if(!this.isSet) { this.checkPos(); }
        // Render card
        // Shadow first 
        if(this.isHld) {
            cx.fillStyle = '#00000033';
            cx.fillRect((w*this.pos.x)-6, (h * this.pos.y)+5, h/10, w/12);
            // cx.fillRect((w*this.pos.x)-4, (h * this.pos.y)+2, h/10, w/9);
        }
        // Flip card
        if(this.flp) {
            cx.save();
            cx.scale(1, -1);
            cx.translate(0, -cx.canvas.height);
            cx.drawImage(img, w * this.pos.x, h - this.pos.y * h - w/10, h/10, w/12);
            cx.restore();
        } else {
            if(this.suit == 'DCK') { cx.drawImage(img, w * this.pos.x - 6, h * this.pos.y - 12, h/8, w/8); }
            else if(this.isHld) { cx.drawImage(img, w * this.pos.x, h * this.pos.y, h/10, w/12); } 
            else { cx.drawImage(img, w * this.pos.x, h * this.pos.y, h/10, w/12); }
        }

        if(this.isHov) {
            cx.fillStyle = '#0000BB80';
            if(this.isHld) { cx.fillStyle = '#FFFFFF40'; }
            cx.fillRect(w*this.pos.x, h * this.pos.y, h/10, w/12);
        }
        // Render rank text 
        if(!this.flp && this.suit != 'DCK' && !this.isHld) {
            cx.font = "normal bolder 12px monospace";
            if(this.suit == 'DMD' || this.suit == 'HRT') { cx.fillStyle = '#900'; } 
            else { cx.fillStyle = '#000'; }
            cx.fillText(this.rank, (this.pos.x+0.0122)*w, (this.pos.y+0.032)*h);
        }
        cx.globalAlpha = 1.0;
    }
    checkPos() {
        let strt = { x: this.pos.x, y: this.pos.y };
        let targ = { x: this.sP.x, y: this.sP.y };
        let xOk = false, yOk = false;

        if (Math.abs(strt.x - targ.x) > this.eps) {
            this.pos.x = lerp(strt.x, targ.x, 0.2);} 
        else { xOk = true; }
        if (Math.abs(strt.y - targ.y) > this.eps) {
            this.pos.y = lerp(strt.y, targ.y, 0.1); } 
        else {yOk = true; }
        // is this card settled in the target location? 
        if (xOk && yOk) { this.isSet = true;
            console.log(this.rank + " SETTLED"); }    
    }

    // Check Bounding box for isHover
    // If isHovered and held, follow mouse location
    checkHover(mX, mY) {
        let wC = h/9;
        let hC = w/9;
        // console.log("checking isHover");
        if(this.isHld) {this.pos.x = (mX/w)-(wC/w/2);
            this.pos.y = (mY/h)-(hC/h/2);}
        return (mX >= w*this.pos.x && mX <= (w*this.pos.x) + wC 
        && mY >= h*this.pos.y && mY <= (h*this.pos.y) + hC);
    }
    // Check on click event 
    checkClick(clk) {
        if(clk) {
            if(this.isHov) { this.isHld = true; return true; }} 
            else { this.isHld = false; return false; }
    }
    resetOnDrop() {
        this.isHld = this.isHov = false;
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
    flipCard() {
        this.flp = true;
        this.setIMG();
    }
    setsP(pos) {
        this.sP.x = pos.x;
        this.sP.y = pos.y;
    }
    setSettled(val) {
        this.isSet = val;
    }
    // Debug print card info
    printCard() {
        console.log("Gen Card: " + this.rank + " of " + this.suit + "s");
    }
    getRank() {
        if(this.rank == undefined) { return '??'; }
        return this.rank;
    }
    getSuit() {
        if(this.suit == 'BCK') { return '??'; }
        return this.suit;
    }
}