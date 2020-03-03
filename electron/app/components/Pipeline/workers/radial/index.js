const { setHierarchy } = require("./hierarchy");
const { getFixedNode } = require("./format");
const Worker = require("./web.worker.js");
const worker = new Worker();

const getRadialData = (path, compound, phases) =>
  new Promise(resolve => {
    const handleEvent = e => {
      worker.removeEventListener("message", handleEvent);

      const { root, flatRoot } = setHierarchy(e.data.radial);
      const segments = root.descendants().map(n => getFixedNode(n, path));
      const arr = path.split("/");
      const trunc = arr[1] === "Tumors" ? arr.slice(0, 7).join("/") : path;
      const { x0, x1 } = flatRoot[trunc];
      const xDomain = [x0, x1];
      const xRange = [0, 2 * Math.PI];

      resolve({ ...e.data, segments, xDomain, xRange });
    };

    worker.addEventListener("message", handleEvent);
    worker.postMessage({ path, compound, phases });
  });

module.exports = { getRadialData };
