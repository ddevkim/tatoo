import "./style.css";
import { go, join } from "fxjs";

const component = () => {
  const el = document.createElement("div");
  el.innerHTML = go(["hello", "vanilla!"], join(" "));
  el.classList.add("hello");
  return el;
};

document.body.appendChild(component());
