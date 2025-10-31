// This file creates the generative art disguise.
let particles = [];

function setup() {
    // MODIFICATION: We are no longer attaching the canvas to a specific element.
    // p5.js will automatically attach it to the <body>, which is more reliable.
    createCanvas(windowWidth, windowHeight); 

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(0, 10); // Black background with a slight trail effect
    for (let particle of particles) {
        particle.update();
        particle.show();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D().mult(random(0.5, 2));
        this.size = random(2, 5);
        this.color = color(random(100, 255), random(100, 255), random(100, 255), 150);
    }

    update() {
        this.pos.add(this.vel);
        if (this.pos.x > width || this.pos.x < 0) this.vel.x *= -1;
        if (this.pos.y > height || this.pos.y < 0) this.vel.y *= -1;
    }

    show() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);
    }
}
