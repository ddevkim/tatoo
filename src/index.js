import "./style.css";
import { loadImg } from "./utils/imageHandler";
import { canvasBlur, cloneCanvas, getImageCanvas } from "./utils/canvasHandler";

const main = async () => {
  const image = await loadImg({ uri: "./assets/example.png" });
  const canvas = getImageCanvas({ image });
  const canvas2 = cloneCanvas({ canvas });

  canvasBlur({ canvas: canvas2 });
  document.body.appendChild(canvas);
  document.body.appendChild(canvas2);
};

(async () => {
  try {
    await main();
  } catch (e) {
    console.error("ERROR", e);
  }
})();
