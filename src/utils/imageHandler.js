import { loadImage as loadImageNodeCanvas } from "canvas";
import { isBrowser } from "./environment";

export async function loadImg({ uri }) {
  if (isBrowser()) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = uri;
      img.onload = () => {
        res(img);
      };
      img.onerror = () => {
        rej(new Error(`Image load fail from ${uri}`));
      };
    });
  } else {
    return loadImageNodeCanvas(uri);
  }
}
