import * as path from "path";

import { getImageData, getImageToCanvas } from "../src/utils/canvasHandler";
import { loadImg } from "../src/utils/imageHandler";
import {
  convolute,
  convoluteAlpha,
  getGaussianKernel,
  imageDataTo2dArray,
  kernelValidation,
} from "../src/utils/pixelManipulation";
import { COLOR_GLUE } from "../src/constants";

const TEST_KERNEL = [
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
];

let canvas;

beforeEach(async () => {
  const image = await loadImg({
    uri: path.resolve("./src/assets/4x4pixels.png"),
  });
  canvas = getImageToCanvas({ image });
});

describe("캔버스 기본 테스트", () => {
  test("[getImageToCanvas] 이미지 => 캔버스 생성", () => {
    expect(canvas).not.toBeNull();
    expect(canvas.width).toEqual(4);
    expect(canvas.height).toEqual(4);
  });
  test("[getImageData] 캔버스 => 이미지 데이터", () => {
    const imageData = getImageData({ canvas });
    expect(imageData.length === 5 * 5 * 4); // 5 (pixel) x 5 (pixel) x 4 (rgba)
  });
});

describe("다채널 픽셀 컨볼루션 테스트", () => {
  test("[convolute] 4채널", () => {
    expect(
      imageDataTo2dArray({
        imageData: getImageData({
          canvas: convolute({ canvas, kernel: TEST_KERNEL }),
        }),
      })
    ).toEqual([
      [
        [171, 119, 96, 255],
        [143, 142, 85, 255],
        [114, 125, 83, 227],
        [73, 70, 90, 198],
      ],
      [
        [109, 131, 122, 255],
        [127, 120, 102, 255],
        [135, 108, 79, 227],
        [128, 96, 52, 198],
      ],
      [
        [91, 136, 147, 255],
        [114, 119, 142, 255],
        [129, 107, 126, 227],
        [115, 110, 90, 198],
      ],
      [
        [146, 121, 100, 255],
        [134, 125, 135, 255],
        [141, 137, 167, 255],
        [117, 146, 165, 255],
      ],
    ]);
  });
});

describe("알파 채널 컨볼루션 + 픽셀 바이너리화", () => {
  test("[kernelValidation] 커널 n x n 2D 스퀘어 행렬 검증", () => {
    expect(() => kernelValidation({ kernel: 1 })).toThrow();
    expect(() => kernelValidation({ kernel: [1, 2, 3] })).toThrow();
    expect(() => kernelValidation({ kernel: [[[1, 2, 3], 2, 3]] })).toThrow();
    expect(() => kernelValidation({ kernel: TEST_KERNEL })).not.toThrow();
  });
  test("[getGaussianKernel] 가우시안 커널 생성", () => {
    expect(getGaussianKernel({ size: 3, sigma: 1.5 })).toEqual([
      [0.04535423476987057, 0.05664058479678963, 0.04535423476987057],
      [0.05664058479678963, 0.0707355302630646, 0.05664058479678963],
      [0.04535423476987057, 0.05664058479678963, 0.04535423476987057],
    ]);
  });
  test("[Pick alpha channel]", () => {
    expect(
      imageDataTo2dArray({
        imageData: getImageData({
          canvas: convoluteAlpha({ canvas, kernel: TEST_KERNEL }),
        }),
      })
    ).toEqual(
      [...Array(4)].map(() => [...Array(4)].map(() => [...COLOR_GLUE, 255]))
    );
  });
});
