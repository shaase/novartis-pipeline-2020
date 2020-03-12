const Worker = require("./web.worker.js");

const worker = new Worker();

const getTableData = (path, compound, phases) =>
  new Promise(resolve => {
    const handleEvent = e => {
      worker.removeEventListener("message", handleEvent);
      resolve(e.data);
    };

    worker.addEventListener("message", handleEvent);
    worker.postMessage({ path, compound, phases });
  });

module.exports = { getTableData };
