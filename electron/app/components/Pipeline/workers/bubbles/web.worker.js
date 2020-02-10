// web worker
import getData from "./data";
import getBubbles from "./d3";

const bubbleData = (path, phases, compound, width, height) => {
  const { data, studyCode, url } = getData(path, phases, compound);
  const bubbles = getBubbles(data, width, height);
  return { data, studyCode, url, bubbles };
};

self.addEventListener(
  "message",
  e => {
    const { path, phases, compound, width, height } = e.data;
    const data = bubbleData(path, phases, compound, width, height);
    self.postMessage(data);
  },
  false,
);
