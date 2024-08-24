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

        this.isHovered = false;
        if(str != null) {
            this.conv = strToIndex(this.str);
            console.log("Converted string: " + this.conv);
        }
    }

    // Render item, width * x, h *y
    // w/h are the canvas width/height
    // ctx is the canvas we draw to 
    render(ctx, w, h) {
        if(this.ix == 0) { //image
            ctx.drawImage(img, w * this.pos.x, h * this.pos.y, h/dx, w/dy);
        }
        else if(this.ix == 1) { //text
            // ctx.drawImage(img, w * this.pos.x, h * this.pos.y, h/dx, w/dy);
            renderFont(ctx, this.x, this.y, w, h, this.dx, this.conv);
        }
        else if(this.ix == 2) { //button
            if(this.isHovered) {
                ctx.globalAlpha = 1;
                drawBox(ctx, this.x*w, this.y*h, this.dx*w, this.dy*w, '#FFF')
                ctx.globalAlpha = 0.5;
                drawBox(ctx, this.x*w, this.y*h, this.dx*w, this.dy*w, this.c)
            } else {
                ctx.globalAlpha = 0.5;
                drawBox(ctx, this.x*w, this.y*h, this.dx*w, this.dy*w, this.c)
            }
            renderFont(ctx, this.x+0.02, this.y+0.01, w, h, 1.5, this.conv);
        }
    }
    checkHover(mX, mY, w, h) {
        let hover = (mX >= w*this.x && mX <= (w*this.x) + w*this.dx 
        && mY >= h*this.y && mY <= (h*this.y) + w*this.dy);
        if(hover) {
            this.isHovered = true;
        } else {
            this.isHovered = false;
        }
        return hover;
    }
}

export default uix;