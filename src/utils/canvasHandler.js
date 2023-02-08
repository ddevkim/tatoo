import { isBrowser } from "./environment";
const { createCanvas: createNodeCanvas } = require("canvas");

export function createCanvas({ width, height }) {
  if (!width || !height) {
    throw new Error("Size is required to create Canvas");
  }
  if (isBrowser()) {
    const canvasEl = document.createElement("canvas");
    canvasEl.width = width;
    canvasEl.height = height;
    return canvasEl;
  } else {
    return createNodeCanvas(width, height);
  }
}

export function drawImgToCanvas({ canvas, image }) {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  return canvas;
}

export function getImageToCanvas({ image }) {
  if (!image) {
    throw new Error("Not exist image");
  }
  const { width, height } = image;
  return drawImgToCanvas({ canvas: createCanvas({ width, height }), image });
}

export function cloneCanvas({ canvas }) {
  const { width, height } = canvas;
  const destCanvas = createCanvas({ width, height });
  const destCtx = destCanvas.getContext("2d");
  destCtx.drawImage(canvas, 0, 0);
  return destCanvas;
}

export function getImageData({ canvas }) {
  const { width, height } = canvas;
  const ctx = canvas.getContext("2d");
  return ctx.getImageData(0, 0, width, height);
}
