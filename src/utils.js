export function drawGrid(ctx) {
  const {
    canvas: { width, height }
  } = ctx;

  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.fillStyle = "blue";

  for (let x = 0; x < width; x += 10) {
    ctx.lineWidth = x % 100 === 0 ? 0.5 : 0.25;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
    ctx.closePath();

    if (x % 100 === 0) {
      ctx.fillText(x, x, 10);
    }
  }

  for (let y = 0; y < height; y += 10) {
    ctx.lineWidth = y % 100 === 0 ? 0.5 : 0.25;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
    ctx.closePath();

    if (y % 100 === 0) {
      ctx.fillText(y, 0, y + 10);
    }
  }

  ctx.restore();
}

// -----------------------------------------------------------------
// COLLISION
// -----------------------------------------------------------------

export function bounceOnBorderCollision(ctx, sphere) {
  const {
    canvas: { width, height }
  } = ctx;

  const { x, y, radius } = sphere;

  // top collision
  if (y - radius <= 0) {
    if (Math.sign(sphere.speed.y) === -1) {
      sphere.speed.y = -sphere.speed.y;
    }
  }

  // bottom collision
  if (y + radius >= height) {
    if (Math.sign(sphere.speed.y) === 1) {
      sphere.speed.y = -sphere.speed.y;
    }
  }

  // left collision
  if (x - radius <= 0) {
    if (Math.sign(sphere.speed.x) === -1) {
      sphere.speed.x = -sphere.speed.x;
    }
  }

  // right collision
  if (x + radius >= width) {
    if (Math.sign(sphere.speed.x) === 1) {
      sphere.speed.x = -sphere.speed.x;
    }
  }
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | speed | The speed of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(speed, angle) {
  const rotatedVelocities = {
    x: speed.x * Math.cos(angle) - speed.y * Math.sin(angle),
    y: speed.x * Math.sin(angle) + speed.y * Math.cos(angle)
  };

  return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * ref: https://gist.github.com/christopher4lis/f9ccb589ee8ecf751481f05a8e59b1dc
 */
export function bounceOnSphereCollision(particle, otherParticle) {
  const xSpeedDiff = particle.speed.x - otherParticle.speed.x;
  const ySpeedDiff = particle.speed.y - otherParticle.speed.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xSpeedDiff * xDist + ySpeedDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.speed, angle);
    const u2 = rotate(otherParticle.speed, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y
    };

    // Final speed after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.speed.x = vFinal1.x;
    particle.speed.y = vFinal1.y;

    otherParticle.speed.x = vFinal2.x;
    otherParticle.speed.y = vFinal2.y;
  }
}

// -----------------------------------------------------------------
// RANDOM
// -----------------------------------------------------------------

export function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomBool() {
  return Math.random() >= 0.5;
}

// -----------------------------------------------------------------
// DISTANCE
// -----------------------------------------------------------------

export function distance(particle, otherParticle) {
  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}
