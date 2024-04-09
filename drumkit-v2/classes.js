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
    if (darkMode) {
      stroke("magenta");
      strokeWeight(1);
    } else {
      noStroke();
    }
    fill(this.brightness, 125);
    ellipse(this.x, this.y, this.r * 3, this.r);
  }
}

//------------------------------------------
// Emitter

class Emitter {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.particles = [];
  }

  addParticle() {
    this.particles.push(new Particle(this.origin.x, this.origin.y));
  }

  run() {
    // Looping through backwards to delete
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].run();
      if (this.particles[i].isDead()) {
        // Remove the particle
        this.particles.splice(i, 1);
      }
    }
  }
}

// Source:
// The Nature of Code by Daniel Shiffman
// http://natureofcode.com

//------------------------------------------
// Particle

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-2, 0));
    this.acceleration = createVector();
    this.lifespan = 255.0;
    this.particleSize = random(5, 15);
  }

  run() {
    let gravity = createVector(0, 0.02);
    this.applyForce(gravity);
    this.update();
    this.show();
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.lifespan -= 9.0;
  }

  show() {
    fill(255, this.lifespan);
    stroke(255, this.lifespan);
    strokeWeight(this.particleSize);
    circle(this.position.x, this.position.y, this.particleSize);
  }

  isDead() {
    return this.lifespan < 0.0;
  }
}

// Reference:
// The Nature of Code by Daniel Shiffman
// http://natureofcode.com
