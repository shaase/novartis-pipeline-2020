const { getTableData } = require("./table"); // path, phases
const { getRadialData } = require("./radial"); // path, phases, width
const { getBubbleData } = require("./bubbles"); // path, phases, compound, width, height

const getWorkerData = (path, phases, compound, width, height) => {
  return Promise.all([
    getTableData(path, phases),
    getRadialData(path, compound, phases),
    getBubbleData(path, phases, compound, width, height),
  ]);
};

module.exports = { getWorkerData };
