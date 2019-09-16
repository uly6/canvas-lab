import {
  bounceOnBorderCollision,
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
  }

  update(ctx, mouse = {}, allSpheres = []) {
    // borders collision
    bounceOnBorderCollision(ctx, this);

    // other sphere collisions
    for (let otherSphere of allSpheres) {
      // ignore if is the "this" sphere
      if (this.x === otherSphere.x) {
        continue;
      }

      if (distance(this, otherSphere) - this.radius * 2 < 0) {
        bounceOnSphereCollision(this, otherSphere);
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
    ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}
