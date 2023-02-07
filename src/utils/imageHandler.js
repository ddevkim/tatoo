export function loadImg({ uri }) {
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
}
