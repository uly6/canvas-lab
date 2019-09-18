import {
  sphereBounceOnBorderCollision,
  bounceOnSphereCollision,
  distance,
  getRandomInt
} from "../utils";

export default class Sphere {
  constructor(x, y, radius, color, mass = 1) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;
    this.color = color;
    this.opacity = 0.1;
    this.speed = {
      x: getRandomInt(1, 4),
      y: getRandomInt(1, 4)
    };
    this.counter = 0;
  }

  update(ctx, mouse = {}, allObjects = []) {
    // borders collision
    sphereBounceOnBorderCollision(ctx, this);

    // other obj collisions
    for (let otherObj of allObjects) {
      // ignore if is the "this" obj
      if (this.x === otherObj.x) {
        continue;
      }

      if (distance(this, otherObj) - this.radius * 2 < 0) {
        // increment counter
        this.counter += 1;
        otherObj.counter += 1;

        // bounce
        bounceOnSphereCollision(this, otherObj);
      }
    }

    // mouse
    if (distance(this, mouse) - this.radius * 2 < 200 && this.opacity <= 0.5) {
      this.opacity += 0.01;
    } else if (this.opacity > 0.1) {
      this.opacity -= 0.01;
    }

    this.x += this.speed.x;
    this.y += this.speed.y;
  }

  draw(ctx) {
    const { r, g, b } = this.color;

    ctx.beginPath();
    ctx.strokeStyle = `rgb(${r}, ${g}, ${b}, 1)`;
    ctx.fillStyle = `rgb(${r}, ${g}, ${b}, ${this.opacity})`;
    ctx.arc(this.x, this.y - 4, this.radius, Math.PI * 2, false);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = `rgb(${r}, ${g}, ${b}, 1)`;
    ctx.textAlign = "center";
    ctx.fillText(this.counter, this.x, this.y, 20);
    ctx.closePath();
  }
}
