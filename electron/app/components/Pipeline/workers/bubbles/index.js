const Worker = require("./web.worker.js");

const worker = new Worker();
const subscribers = [];

const onMessage = e => {
  subscribers.forEach(sub => {
    sub(e.data);
  });
};

worker.addEventListener("message", onMessage);

const postBubbleUpdate = (path, phases, compound, width, height) => {
  worker.postMessage({ path, phases, compound, width, height });
};

const subscribeToBubbleUpdates = callback => {
  subscribers.push(callback);
};

module.exports = { postBubbleUpdate, subscribeToBubbleUpdates };
