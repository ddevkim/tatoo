import "./style.css";
import { loadImg } from "./utils/imageHandler";
import { cloneCanvas, getImageToCanvas } from "./utils/canvasHandler";

const main = async () => {
  const image = await loadImg({ uri: "./assets/example.png" });
  const canvas = getImageToCanvas({ image });
  const canvas2 = cloneCanvas({ canvas });

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
