import { createCanvas, getImageData } from "./canvasHandler";
import { chunkL, deepFlat, go, map, mapL, range, sum, takeAll } from "fxjs";
import { COLOR_GLUE } from "../constants";

/* Todo
 * 1. 일반 convolute function 이랑 추상화 합치는 작업
 * 2. image import, export, trigger 작업
 * 3. webWorker or webGl 검토
 * */
export function convoluteAlpha({ canvas, kernel, color }) {
  kernelValidation({ kernel });
  if (!color) {
    color = COLOR_GLUE;
  }
  const srcImageData = getImageData({ canvas });
  const { width: w, height: h } = srcImageData;

  const destCanvas = createCanvas({ width: w, height: h });
  const destImageData = getImageData({ canvas: destCanvas });

  const kernelHalfSize = Math.floor(kernel.length / 2);
  // target pixel point from src at (x, y)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = getPixelIdx({ x, y, w });

      const convolutedPixel = getConvoluteAlphaChannel({
        kernel,
        imageData: srcImageData,
        getConvPixelFn: ({ kernelX, kernelY }) => {
          return {
            x: limitRange(x + (kernelX - kernelHalfSize), 0, w - 1),
            y: limitRange(y + (kernelY - kernelHalfSize), 0, h - 1),
          };
        },
        color,
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

export function kernelValidation({ kernel }) {
  // Array
  if (!Array.isArray(kernel)) {
    throw new Error("Kernel is not an array");
  }

  // 2D array
  if (!Array.isArray(kernel[0]) && Array.isArray(kernel[0][0])) {
    throw new Error("Kernel is not an 2D array");
  }

  // isSquare
  if (kernel.length !== kernel[0].length) {
    throw new Error("Kernel window must be a square");
  }
}

export function convolute({ canvas, kernel }) {
  kernelValidation({ kernel });
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
        divisor: getKernelDivisor({ kernel }),
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

function getKernelDivisor({ kernel }) {
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

function getConvoluteAlphaChannel({
  kernel,
  imageData,
  getConvPixelFn,
  color,
}) {
  let alphaValue = 0;
  for (let kernelY in kernel) {
    for (let kernelX in kernel[kernelY]) {
      const weight = kernel[kernelY][kernelX];

      const convPixel = getConvPixelFn({
        kernelX,
        kernelY,
      });
      const convPixelIdx = getPixelIdx({ ...convPixel, w: imageData.width });
      const convPixelChIdx = convPixelIdx + 3; // alpha
      alphaValue += imageData.data[convPixelChIdx] * weight;
    }
  }
  if (alphaValue > 0) {
    return [...color, 255];
  } else {
    return [0, 0, 0, 0];
  }
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

// https://en.wikipedia.org/wiki/Gaussian_function

export function getDistanceFromCenter({ center, x, y }) {
  return (x - center) ** 2 + (y - center) ** 2;
}

export function getGaussianKernel({ size, sigma }) {
  if (size <= 0) {
    throw new Error("Size must be a positive");
  }
  if (sigma <= 0) {
    throw new Error("Sigma must be a positive");
  }
  const center = (size - 1) / 2;
  const coeff = 1 / 2 / Math.PI / sigma ** 2;
  const denominator = 2 * sigma ** 2;
  return go(
    range(size),
    map((y) => {
      return go(
        range(size),
        map((x) => {
          const numerator = -getDistanceFromCenter({ center, x, y });
          return coeff * Math.exp(numerator / denominator);
        })
      );
    })
  );
}
