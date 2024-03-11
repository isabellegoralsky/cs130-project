

export default function sketch(p){

    let dots;

    p.setup = () => {
        p.createCanvas(576, 813);
        p.noStroke();

        //p.colorMode(p.HSB, 360, 100, 100);
      
        dots = [];
        for (let i = 0; i < 24; i++) {
           dots.push(new BouncyDot());
        }
    }
      
    p.draw = () => {
        // p.ellipse(150, 100, 100, 100);
        p.background('#ff5a13');
        for (let i = 0; i < dots.length; i++) {
            dots[i].float();
            dots[i].display();
        }
    }

    class BouncyDot {
        constructor() {
          // Randomly generate position
          this.x = p.random(576);
          this.y = p.random(813);
          // Randomly generate radius
          this.r = p.random(30, 100);
          // Randomly generate color
          this.color = p.random(['rgba(254,192,20,.8)', 'rgba(253,3,2,.8)', 'rgba(255,114,10,.8)']);
          // Randomly generate a master velocity (broken into components)...
          this.masterXvelocity = p.random(0.5, 3);
          this.masterYvelocity = p.random(0.5, 3);
          // ...and use those as starting velocities.
          this.xVelocity = this.masterXvelocity;
          this.yVelocity = this.masterYvelocity;
        }
      
        float() {
          this.x += this.xVelocity;
          this.y += this.yVelocity;
          // Standard bounce code - like the DVD logo, but for spheres.
          if (this.x + this.r > 576) {
            this.xVelocity = -1 * this.masterXvelocity;
          }
          if (this.x - this.r < 0) {
            this.xVelocity = this.masterXvelocity;
          }
          if (this.y + this.r > 813) {
            this.yVelocity = -1 * this.masterYvelocity;
          }
          if (this.y - this.r < 0) {
            this.yVelocity = this.masterYvelocity;
          }
        }
      
        display() {
          p.fill(this.color);
          p.noStroke();
          p.ellipse(this.x, this.y, this.r * 2);
        }
    }
      
    //   function mousePressed() {
    //     // We'll use this for console log statements only.
    //     console.log(dots[5].x);
    //   }

    /* balls */
}