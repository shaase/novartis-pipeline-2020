import { scaleLinear, scaleSqrt } from "d3-scale";
import { interpolate as d3interpolate } from "d3-interpolate";
import { RadialNode, NodeLabel, CurvePosition, NodeLabelLine } from "../../../types";
import { itemsForPath } from "../../../utils";
import { labelArc } from "./label-arc";

import sizedText from "./sized-text";

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

    return { display, color: "#000000", opacity, startArc, endArc };
  });

  // filter out hidden node labels
  const filtered: NodeLabel[] = labels.filter(
    (label: NodeLabel) => label.startArc.display !== "none" || label.endArc.display !== "none",
  );

  return filtered;
};
