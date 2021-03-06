const Worker = require("./web.worker.js");

const worker = new Worker();

const getBubbleData = (path, phases, compound, width, height) =>
  new Promise(resolve => {
    const handleEvent = e => {
      worker.removeEventListener("message", handleEvent);
      resolve(e.data);
    };

    worker.addEventListener("message", handleEvent);
    worker.postMessage({ path, phases, compound, width, height });
  });

module.exports = { getBubbleData };
