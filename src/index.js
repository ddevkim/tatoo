import "./style.css";
import { loadImg } from "./utils/imageHandler";
import { compositeCanvas, getImageToCanvas } from "./utils/canvasHandler";
import { convoluteAlpha, getGaussianKernel } from "./utils/pixelManipulation";
import { logTime, pNow } from "./utils/environment";
import { COLOR_GLUE } from "./constants";

const main = async () => {
  const canvasDesign = getImageToCanvas({
    image: await loadImg({ uri: "./assets/flower_1024.png" }),
  });
  const start = pNow();
  const canvasGlue = convoluteAlpha({
    canvas: canvasDesign,
    kernel: getGaussianKernel({ size: 5, sigma: 3 }),
    color: COLOR_GLUE,
  });
  logTime({ start });

  document.body.appendChild(
    compositeCanvas({
      srcCanvas: canvasGlue,
      destCanvas: canvasDesign,
      compositeOperation: "source-over",
    })
  );
};

(async () => {
  try {
    await main();
  } catch (e) {
    console.error("ERROR", e);
  }
})();
