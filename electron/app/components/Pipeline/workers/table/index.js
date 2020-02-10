const Worker = require("./web.worker.js");

const worker = new Worker();
const subscribers = [];

const onMessage = e => {
  subscribers.forEach(sub => {
    sub(e.data);
  });
};

worker.addEventListener("message", onMessage);

const postTableUpdate = (path, phases) => {
  worker.postMessage({ path, phases });
};

const subscribeToTableUpdates = callback => {
  subscribers.push(callback);
};

module.exports = { postTableUpdate, subscribeToTableUpdates };
