import {
  rectBounceOnBorderCollision,
  bounceOnSphereCollision,
  distance,
  getRandomInt
} from "../utils";

export default class Rect {
  constructor(x, y, width, height, color, mass = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.mass = mass;
    this.color = color;
    this.opacity = 0.1;
    this.speed = {
      x: getRandomInt(1, 4),
      y: getRandomInt(1, 4)
    };
    this.counter = 0;
  }

  update(ctx, config = {}, mouse = {}, allObjects = []) {
    // borders collision
    rectBounceOnBorderCollision(ctx, this);

    // other obj collisions
    for (let otherObj of allObjects) {
      // ignore if is the "this" obj
      if (this.x === otherObj.x) {
        continue;
      }

      if (
        distance(this, otherObj) - this.width < 0 ||
        distance(this, otherObj) - this.width < 0
      ) {
        // increment counter
        this.counter += 1;
        otherObj.counter += 1;
        // bounce
        bounceOnSphereCollision(this, otherObj);
      }
    }

    // mouse
    if (distance(this, mouse) - this.width < 200 && this.opacity <= 0.5) {
      this.opacity += 0.01;
    } else if (this.opacity > 0.1) {
      this.opacity -= 0.01;
    }

    this.x += this.speed.x;
    this.y += this.speed.y;
  }

  draw(ctx, config = {}) {
    const { r, g, b } = this.color;

    ctx.strokeStyle = `rgb(${r}, ${g}, ${b}, 1)`;
    ctx.fillStyle = `rgb(${r}, ${g}, ${b}, ${this.opacity})`;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    if (config.showCollisionCounters) {
      ctx.fillStyle = `rgb(${r}, ${g}, ${b}, 1)`;
      ctx.textAlign = "center";
      ctx.fillText(
        this.counter,
        this.x + this.width / 2,
        this.y + this.height / 2 + 4,
        20
      );
    }
  }
}
