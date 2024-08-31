/////////////////////////////////////////////////////
// User Interface 'X' Class
// Multi class for a variety of UI objects
/////////////////////////////////////////////////////
// uix object (where x = the type)
// 0 image 
// 1 text 
// 2 button
class uix {
    constructor(ix, x, y, dx, dy, c, str, img) {
        this.ix = ix;   // UIX type
        this.x = x;     // x position
        this.y = y;     // y position
        this.dx = dx;     // x dimension
        this.dy = dy;     // y dimension
        this.c = c;     // color
        this.str = str; // string
        this.img = img; // image

        this.isAc = false, this.isHov = false, this.clk = false, this.pld = false;
        if(str != null) {
            this.conv = strToIndex(this.str);
            console.log("Converted string: " + this.conv);
        } // Buttons need to be activated via call
        if(this.ix != 2) { this.isAc = true; }
    }
    render() {
        if(this.isAc) {
            if(this.ix == 0) { //image
                cx.drawImage(img, w * this.pos.x, h * this.pos.y, h/dx, w/dy); }
            else if(this.ix == 1) { //text
                // cx.drawImage(img, w * this.pos.x, h * this.pos.y, h/dx, w/dy);
                renderFont(cx, this.x, this.y, w, h, this.dx, this.conv); }
            else if(this.ix == 2) { //button
                
                if(this.isHov) {
                    if(this.clk) {
                        cx.globalAlpha = 0.8;
                        drawBox(cx, this.x*w, this.y*h, this.dx*w, this.dy*w, '#FFF')
                    } else {
                        cx.globalAlpha = 0.4;
                        drawBox(cx, this.x*w, this.y*h, this.dx*w, this.dy*w, '#AAA') }
                    cx.globalAlpha = 0.5;
                    drawBox(cx, this.x*w, this.y*h, this.dx*w, this.dy*w, this.c)
                } else {
                    cx.globalAlpha = 0.3;
                    drawBox(cx, this.x*w, this.y*h, this.dx*w, this.dy*w, this.c) }
                cx.globalAlpha = 1.0;
                renderFont(cx, this.x+0.02, this.y+0.01, w, h, 1.5, this.conv);
                cx.globalAlpha = 0.8;
            } }
        cx.globalAlpha = 1.0;
    }
    checkHover(mX, mY) {
        if(this.isAc) {
            let hover = (mX >= w*this.x && mX <= (w*this.x) + w*this.dx 
            && mY >= h*this.y && mY <= (h*this.y) + w*this.dy);
                if(hover) {
                    this.isHov = true;
                    // hover SFX, toggle if played
                    if(!this.pld) {
                        this.pld = true;
                        zzfx(...[3,,194,,.04,.02,,3,-7,,-50,.39,,,,,,.51,.02,.03,930]); // button hover
                    }
                    return true;
                } else {
                    //reset
                    this.isHov = false;
                    this.pld = false;
                    this.clk = false;
                    return false; }
        } else {
            return false; }
    }
    // Check on click event 
    checkClick(clk) {
        if(clk) {
            if(this.isHov) {
                this.clk = true;
                return true; }
        } else {
            this.clk = false;
            return false; }
        // console.log("clk: " + clk);
    }
    // Toggles active state of element
    togActive(v) {
        if(v) {
            this.isAc = v;
            console.log("active: " + this.str);
        } else {
            this.isHov = false;
            this.clk = false; 
        }
    }
}