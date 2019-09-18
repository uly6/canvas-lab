import * as dat from "dat.gui";
import Rect from "./rect";
import { drawGrid, getRandomInt } from "../utils";

// experiment controller
const config = {
  showGrid: false,
  showCollisionCounters: false,
  rectWidth: 35,
  rectHeight: 35,
  restart: init
};

const gui = new dat.GUI();
gui.add(config, "showGrid");
gui.add(config, "showCollisionCounters");
gui.add(config, "rectWidth", 10, 50);
gui.add(config, "rectHeight", 10, 50);
gui.add(config, "restart");

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

  // create objects - same number per color
  const total = 250;
  const totalPerColor = total / colors.length;
  for (let i = 0; i < total; i++) {
    canvasObjects.push(
      new Rect(
        getRandomInt(0, canvas.width - config.rectWidth),
        getRandomInt(0, canvas.height - config.rectHeight),
        config.rectWidth,
        config.rectHeight,
        colors[Math.floor(i / totalPerColor)]
      )
    );
  }
}

function update(deltaTime) {
  // update all objects on canvas
  for (let canvasOnject of canvasObjects) {
    // update and draw
    canvasOnject.update(ctx, config, mouse, canvasObjects);
    canvasOnject.draw(ctx, config);
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
animationLoop(0);
