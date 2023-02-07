export function createCanvas({ width, height }) {
  const canvasEl = document.createElement("canvas");
  if (width) canvasEl.width = width;
  if (height) canvasEl.height = height;

  return canvasEl;
}

export function drawImgToCanvas({ canvas, image }) {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  return canvas;
}

export function getImageCanvas({ image }) {
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

export function canvasBlur({ canvas }) {
  const ctx = canvas.getContext("2d");
  ctx.filter = `blur(10px)`;
}
