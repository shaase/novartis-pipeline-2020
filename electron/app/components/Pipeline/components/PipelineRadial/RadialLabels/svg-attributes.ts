import { arc } from "d3-shape";
import { interpolate as d3interpolate } from "d3-interpolate";
import { NodeLabel } from "../../../types";
import lineRotation from "./line-rotation";
import lineOffset from "./line-offset";

export const labelCurve = (
  label: NodeLabel,
  iterator: number,
  index: number,
  length: number,
  fontSize: number,
): string => {
  const ad = d3interpolate(label.startArc, label.endArc);
  const iArc = ad(iterator);
  const { startAngle, endAngle, centerAngle, centerRadius } = iArc;
  const isUnder = centerAngle > 1.57 && centerAngle < 4.71;

  const a0 = isUnder ? endAngle : startAngle;
  const a1 = isUnder ? startAngle : endAngle;
  const yOffset = lineOffset(index, length, fontSize, isUnder);
  const offsetRadius = centerRadius + yOffset;

  const curve = arc()
    .startAngle(a0)
    .endAngle(a1)
    .outerRadius(offsetRadius);

  return String(curve).replace("LNaN,NaNZ", "");
};

export const labelAnchor = (label: NodeLabel, pathRoot: string, lines: number): string => {
  const { node } = label;
  if (lines === 1 && !node.isStudyContainer) return "middle";
  if (pathRoot === "Compounds" && node.depth === 4) return "middle";

  const { centerAngle } = label.endArc;
  const isRight = centerAngle < Math.PI;
  return isRight ? "start" : "end";
};

export const labelTransform = (
  label: NodeLabel,
  iterator: number,
  pathRoot: string,
  index: number,
  length: number,
  fontSize: number,
): string => {
  const ad = d3interpolate(label.startArc, label.endArc);
  const iArc = ad(iterator);
  const { startAngle, endAngle, centroid } = iArc;
  const { centerAngle } = label.endArc;
  if (Number.isNaN(startAngle)) return "translate(0, 0) rotate(-90) rotate(0)";

  const isRight = centerAngle < Math.PI;
  const rDiff = lineRotation(index, length, fontSize, startAngle, endAngle, isRight);
  const { x, y } = centroid;
  const rot = isRight ? rDiff : rDiff + Math.PI;
  const style = `translate(${x}, ${y}) rotate(-90) rotate(${(rot * 180) / Math.PI})`;
  return style;
};
