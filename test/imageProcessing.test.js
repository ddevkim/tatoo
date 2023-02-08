import * as path from "path";

import { getImageData, getImageToCanvas } from "../src/utils/canvasHandler";
import { loadImg } from "../src/utils/imageHandler";
import { convolute, imageDataTo2dArray } from "../src/utils/pixelManipulation";

const kernel = [
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
    expect(canvas.width).toEqual(5);
    expect(canvas.height).toEqual(5);
  });
  test("[getImageData] 캔버스 => 이미지 데이터", () => {
    const imageData = getImageData({ canvas });
    expect(imageData.length === 5 * 5 * 4); // 5 (pixel) x 5 (pixel) x 4 (rgba)
  });
});

describe("픽셀 조작 테스트", () => {
  test("[convolute] 커널 컨볼루션 적용", () => {
    expect(
      imageDataTo2dArray({
        imageData: getImageData({ canvas: convolute({ canvas, kernel }) }),
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
