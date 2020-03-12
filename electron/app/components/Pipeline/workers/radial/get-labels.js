const { scaleLinear, scaleSqrt } = require("d3-scale");
const { getTextDisplay } = require("../../components/PipelineRadial/RadialLabels/text-display");
const { getArcLength, getArcWidth } = require("../../components/PipelineRadial/RadialLabels/arc-sizes");
const xScale = scaleLinear();
const yScale = scaleSqrt();
let prevLabels = [];

const arcLength = node => getArcLength(node, xScale, yScale);
const arcWidth = node => getArcWidth(node, yScale);

const getLabels = (nodes, path, xDomain, xRange, yDomain, yRange) => {
  xScale.domain(xDomain).range(xRange);
  yScale.domain(yDomain).range(yRange);

  const labels = nodes.filter(node => {
    return getTextDisplay(node, path, arcLength, arcWidth) !== "none";
  });

  const allLabels = [...prevLabels, ...labels];
  prevLabels = labels;
  return allLabels;
};

module.exports = { getLabels };
