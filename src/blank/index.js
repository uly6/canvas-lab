import * as dat from "dat.gui";
import { drawGrid, getRandomInt } from "../utils";

// experiment controller
const config = {
  showGrid: true
};

const gui = new dat.GUI();
gui.add(config, "showGrid");

// canvas context
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// track mouse position
const mouse = {
  x: -300,
  y: -300
};

// event listeners
window.addEventListener("mousemove", event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

window.addEventListener("resize", () => {
  resizeCanvasToFullScreen(canvas);
});

// resize canvas to full screen size
resizeCanvasToFullScreen(canvas);

function resizeCanvasToFullScreen(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
}

let canvasObjects;

function init() {
  // set default values
  canvasObjects = [];

  // colors in rgb
  const colors = [
    { r: 176, g: 23, b: 26 },
    { r: 236, g: 147, b: 65 },
    { r: 0, g: 157, b: 195 },
    { r: 178, g: 178, b: 197 },
    { r: 1, g: 62, b: 92 }
  ];

  // start animation loop
  animationLoop(0);
}

function update(deltaTime) {
  // update all objects on canvas
  for (let canvasOnject of canvasObjects) {
    // update and draw
    canvasOnject.update(ctx, mouse, canvasObjects);
    canvasOnject.draw(ctx);
  }
}

function animationLoop(timestamp) {
  // clean canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (config.showGrid) {
    // draw grid
    drawGrid(ctx);
  }

  // update canvas objects
  update(timestamp);

  // loop every frame
  requestAnimationFrame(animationLoop);
}

// start point
init();
