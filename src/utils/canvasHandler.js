export function createCanvas({ width, height }) {
  const canvasEl = document.createElement("canvas");
  if (width) canvasEl.width = width;
  if (height) canvasEl.height = height;

  return canvasEl;
}

export function drawImgToCanvas({ canvasEl, image }) {
  const ctx = canvasEl.getContext("2d");
  ctx.drawImage(image, 0, 0);
  return canvasEl;
}

export function getImageCanvas({ image }) {
  const { width, height } = image;
  return drawImgToCanvas({ canvasEl: createCanvas({ width, height }), image });
}
