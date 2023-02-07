import "./style.css";
import { loadImg } from "./utils/imageHandler";
import { drawImgToCanvas, getImageCanvas } from "./utils/canvasHandler";

const main = async () => {
  const image = await loadImg({ uri: "./assets/lake.jpg" });
  const canvasEl = getImageCanvas({ image });
  drawImgToCanvas({ canvasEl, image });
  document.body.appendChild(canvasEl);
};

(async () => {
  try {
    await main();
  } catch (e) {
    console.error("ERROR", e);
  }
})();
