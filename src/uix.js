/////////////////////////////////////////////////////
// User Interface 'X' Class
// Multi class for a variety of UI objects
/////////////////////////////////////////////////////
// uix object (where x = the type)
// 0 image 
// 1 text 
// 2 button
import { spriteMinis, drawBox, strToIndex, renderFont } from './graphics.js';
import { lerp } from './math.js';
import { zzfx } from './zzfx.js';

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

        this.isActive = false;
        this.isHovered = false;
        this.click = false;
        this.played = false;
        if(str != null) {
            this.conv = strToIndex(this.str);
            console.log("Converted string: " + this.conv);
        }
        if(this.ix != 2) { //Buttons need to be activated via call
            this.isActive = true;
        }
    }

    // Render item, width * x, h *y
    // w/h are the canvas width/height
    // ctx is the canvas we draw to 
    render(ctx, w, h) {
        if(this.isActive) {
            if(this.ix == 0) { //image
                ctx.drawImage(img, w * this.pos.x, h * this.pos.y, h/dx, w/dy);
            }
            else if(this.ix == 1) { //text
                // ctx.drawImage(img, w * this.pos.x, h * this.pos.y, h/dx, w/dy);
                renderFont(ctx, this.x, this.y, w, h, this.dx, this.conv);
            }
            else if(this.ix == 2) { //button
                renderFont(ctx, this.x+0.02, this.y+0.01, w, h, 1.5, this.conv);
                if(this.isHovered) {
                    if(this.click) {
                        ctx.globalAlpha = 0.8;
                        drawBox(ctx, this.x*w, this.y*h, this.dx*w, this.dy*w, '#FFF')
                    } else {
                        ctx.globalAlpha = 0.4;
                        drawBox(ctx, this.x*w, this.y*h, this.dx*w, this.dy*w, '#AAA')
                    }
                    ctx.globalAlpha = 0.5;
                    drawBox(ctx, this.x*w, this.y*h, this.dx*w, this.dy*w, this.c)
                } else {
                    ctx.globalAlpha = 0.3;
                    drawBox(ctx, this.x*w, this.y*h, this.dx*w, this.dy*w, this.c)
                }
                ctx.globalAlpha = 0.8;
            }
        }
    }
    checkHover(mX, mY, w, h) {
        if(this.isActive) {
            let hover = (mX >= w*this.x && mX <= (w*this.x) + w*this.dx 
            && mY >= h*this.y && mY <= (h*this.y) + w*this.dy);
                if(hover) {
                    this.isHovered = true;
                    //hover SFX
                    if(!this.played) {
                        this.played = true;
                        zzfx(...[3,,194,,.04,.02,,3,-7,,-50,.39,,,,,,.51,.02,.03,930]); 
                    }
                    return true;
                } else {
                    //reset
                    this.isHovered = false;
                    this.played = false;
                    this.click = false;
                    return false;
                }
                return hover;
        } else {
            return false;
        }
    }
    // Check on click event 
    checkClick(clk) {
        if(clk) {
            if(this.isHovered) {
                this.click = true;
                return true;
            }
        } else {
            this.click = false;
            return false;
        }
        // console.log("click: " + clk);
    }
    // Toggles active state of element
    togActive(v) {
        this.isActive = v;
        if(!v) {
            this.isHovered = false;
            this.click = false;
        }
    }
}

export default uix;