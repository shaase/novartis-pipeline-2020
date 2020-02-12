const { getTableData } = require("./table"); // path, phases
const { getRadialData } = require("./radial"); // path, phases, width
const { getBubbleData } = require("./bubbles"); // path, phases, compound, width, height
const { dataForRadial, defaultPhases } = require("../data");
const { setHierarchy } = require("./radial/hierarchy");

const { root: defaultRoot } = setHierarchy(dataForRadial(defaultPhases));

const getWorkerData = (path, phases, compound, width, height) => {
  return Promise.all([
    getTableData(path, phases),
    getRadialData(path, compound, phases),
    getBubbleData(path, phases, compound, width, height),
  ]);
};

module.exports = { getWorkerData, defaultRoot };
