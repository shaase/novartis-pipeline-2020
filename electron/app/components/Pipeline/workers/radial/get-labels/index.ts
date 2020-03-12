import { scaleLinear, scaleSqrt } from "d3-scale";
import { RadialNode, NodeLabel, CurvePosition, NodeLabelLine } from "../../../types";
import { itemsForPath } from "../../../utils";
import { getTextDisplay } from "./text-display";
import { getArcLength, getArcWidth } from "./arc-sizes";
import { updateDomain, getAttributes } from "./svg-attributes";

import sizedText from "./sized-text";

const xScale = scaleLinear();
const yScale = scaleSqrt();
let prevLabels: NodeLabel[] = [];

const arcLength = (node: RadialNode): number => getArcLength(node, xScale, yScale);
const arcWidth = (node: RadialNode): number => getArcWidth(node, yScale);
const textDisplay = (node: RadialNode, path: string): string => getTextDisplay(node, path, arcLength, arcLength);

export const getLabels = (
  nodes: RadialNode[],
  path: string,
  xDomain: number[],
  xRange: number[],
  yDomain: number[],
  yRange: number[],
): NodeLabel[] => {
  const { root: pathRoot } = itemsForPath(path);
  xScale.domain(xDomain).range(xRange);
  yScale.domain(yDomain).range(yRange);
  updateDomain(xScale, yScale, xDomain, xRange);

  // filter out hidden node labels
  const labelNodes: RadialNode[] = nodes.filter(
    (node: RadialNode) => getTextDisplay(node, path, arcLength, arcWidth) !== "none",
  );

  // format labels
  const labels: NodeLabel[] = labelNodes.map((node: RadialNode) => {
    const { name, route, color, textOpacity: opacity } = node;
    const length = arcLength(node);
    const width = arcWidth(node);
    const display = textDisplay(node, path);
    const isCurved = display.includes("curved");
    const w = isCurved ? length - 6 : width - 7;
    const height = isCurved ? width : length;
    const { lines: l, fontSize, offsets } = sizedText({
      path,
      display,
      route,
      name,
      width: w,
      height,
    });

    const lines: NodeLabelLine[] = l.map((elements: JSX.Element | JSX.Element[], index: number) => {
      const id = `${elements}-${index}`;
      const { curve, anchor, transform } = getAttributes(node, pathRoot, index, l.length, fontSize);
      return { id, elements, curve, anchor, transform };
    });

    return { display, color: "#000000", opacity, lines, fontSize, offsets };
  });

  const allLabels: NodeLabel[] = [...prevLabels, ...labels];
  prevLabels = labels;

  console.log(allLabels);

  return allLabels;
};
