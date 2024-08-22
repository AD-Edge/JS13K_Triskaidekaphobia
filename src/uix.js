/////////////////////////////////////////////////////
// User Interface 'X' Class
// Multi class for a variety of UI objects
/////////////////////////////////////////////////////
// uix object (where x = the type)
// 0 image 
// 1 text 
// 2 button
import { spriteMinis } from './graphics.js';
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
    }

    // Render item, width * x, h *y
    // w/h are the canvas width/height
    // ctx is the canvas we draw to 
    render(ctx, w, h) {
        if(ix == 0) { //image
            ctx.drawImage(img, w * this.pos.x, h * this.pos.y, h/dx, w/dy);
        }
    }
}

export default uix;