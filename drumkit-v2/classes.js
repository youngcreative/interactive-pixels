//------------------------------------------
// Drum

class Drum {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.brightness = 0;
  }

  changeColor(bright) {
    this.brightness = bright;
  }

  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.r) {
      return true;
    } else {
      return false;
    }
  }

  show() {
    noStroke();
    fill(this.brightness, 125);
    ellipse(this.x, this.y, this.r * 3, this.r);
  }
}
