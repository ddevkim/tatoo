import { createCanvas, getImageData } from "./canvasHandler";
import { chunkL, deepFlat, go, mapL, sum, takeAll } from "fxjs";

export function convolute({ canvas, kernel }) {
  const srcImageData = getImageData({ canvas });
  const { width: w, height: h } = srcImageData;

  const destCanvas = createCanvas({ width: w, height: h });
  const destImageData = getImageData({ canvas: destCanvas });
  const kernelHalfSize = Math.floor(kernel.length / 2);

  // target pixel point from src at (x, y)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = getPixelIdx({ x, y, w });

      const convolutedPixel = getConvolutedValue({
        kernel,
        divisor: getKernalDivisor({ kernel }),
        imageData: srcImageData,
        getConvPixelFn: ({ kernelX, kernelY }) => {
          return {
            x: limitRange(x + (kernelX - kernelHalfSize), 0, w - 1),
            y: limitRange(y + (kernelY - kernelHalfSize), 0, h - 1),
          };
        },
      });

      iterateChannels(({ channel }) => {
        destImageData.data[idx + channel] = convolutedPixel[channel];
      });
    }
  }

  return applyImageDataToCanvas({
    canvas: destCanvas,
    imageData: destImageData,
  });
}

function applyImageDataToCanvas({ canvas, imageData }) {
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function getKernalDivisor({ kernel }) {
  let divisor = sum(deepFlat(kernel));
  if (divisor === 0) {
    return 1;
  } else {
    return divisor;
  }
}

function limitRange(val, min, max) {
  return Math.min(Math.max(min, val), max);
}

function getConvolutedValue({ kernel, divisor, imageData, getConvPixelFn }) {
  const convolutedPixel = [0, 0, 0, 0];
  for (let kernelY in kernel) {
    for (let kernelX in kernel[kernelY]) {
      const weight = kernel[kernelY][kernelX];

      const convPixel = getConvPixelFn({
        kernelX,
        kernelY,
      });
      const convPixelIdx = getPixelIdx({ ...convPixel, w: imageData.width });

      iterateChannels(({ channel }) => {
        const convPixelChIdx = convPixelIdx + channel;
        convolutedPixel[channel] += imageData.data[convPixelChIdx] * weight;
      });
    }
  }

  return convolutedPixel.map((channel) => channel / divisor);
}

function getPixelIdx({ x, y, w }) {
  return (y * w + x) * 4;
}

function iterateChannels(fn) {
  for (let channel of [0, 1, 2, 3]) {
    fn({ channel });
  }
}

export function imageDataTo2dArray({ imageData, channel }) {
  return go(
    imageData.data,
    chunkL(4),
    mapL((pixel) => (channel != null ? pixel[channel] : pixel)),
    chunkL(imageData.width),
    takeAll
  );
}
