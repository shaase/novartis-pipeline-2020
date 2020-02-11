const { getTableData } = require("./table"); // path, phases
const { getRadialHierarchy } = require("./radial"); // phasess
const { getBubbleData } = require("./bubbles"); // path, phases, compound, width, height

const getWorkerData = (path, phases, compound, width, height) => {
  return Promise.all([
    getTableData(path, phases),
    getRadialHierarchy(phases),
    getBubbleData(path, phases, compound, width, height),
  ]);
};

module.exports = { getWorkerData };
