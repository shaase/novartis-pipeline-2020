import { scaleLinear, scaleSqrt } from "d3-scale";
import { RadialNode, NodeLabel, NodeLabelLine } from "../../../types";
import { labelArc } from "./label-arc";

const xScale = scaleLinear();
const yScale = scaleSqrt();
const prevXScale = scaleLinear();
const prevYScale = scaleSqrt();
let hasSetScale = false;

export const getLabels = (
  nodes: RadialNode[],
  path: string,
  xDomain: number[],
  xRange: number[],
  yDomain: number[],
  yRange: number[],
): NodeLabel[] => {
  xScale.domain(xDomain).range(xRange);
  yScale.domain(yDomain).range(yRange);

  if (!hasSetScale) {
    prevXScale.domain(xDomain).range(xRange);
    prevYScale.domain(yDomain).range(yRange);
    hasSetScale = true;
  }

  // format labels
  const labels: NodeLabel[] = nodes.map((node: RadialNode) => {
    const { textOpacity: opacity } = node;
    const startArc = labelArc(node, path, prevXScale, prevYScale);
    const endArc = labelArc(node, path, xScale, yScale);
    const { display } = endArc;

    const lines: NodeLabelLine[] = [];
    const fontSize = 18;
    const offsets: number[] = [];

    return { node, display, color: "#FFFFFF", opacity, startArc, endArc, lines, fontSize, offsets };
  });

  // filter out hidden node labels
  const filtered: NodeLabel[] = labels.filter(
    (label: NodeLabel) => label.startArc.display !== "none" || label.endArc.display !== "none",
  );

  prevXScale.domain(xDomain).range(xRange);
  prevYScale.domain(yDomain).range(yRange);

  return filtered;
};
