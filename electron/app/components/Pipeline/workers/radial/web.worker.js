// web worker
import { dataForRadial } from "../../data";
import setHierarchy from "./hierarchy";

self.addEventListener(
  "message",
  e => {
    const { phases } = e.data;
    const { root, flatRoot } = setHierarchy(dataForRadial(phases));
    self.postMessage({ root, flatRoot });
  },
  false,
);
