import { ScaleLinear, ScalePower } from "d3-scale";
import { RadialNode, RadialArc, Origin } from "../../../types";
import { textDisplay } from "./text-display";

export const labelArc = (
  node: RadialNode,
  path: string,
  xScale: ScaleLinear<number, number>,
  yScale: ScalePower<number, number>,
): RadialArc => {
  const { x0 = 0, x1 = 0, y0 = 0, y1 = 0 } = node;
  const startAngle = Math.max(0, Math.min(2 * Math.PI, xScale(x0)));
  const endAngle = Math.max(0, Math.min(2 * Math.PI, xScale(x1)));
  const centerAngle = startAngle + (endAngle - startAngle) / 2;

  const innerRadius = Math.max(0, yScale(y0));
  const outerRadius = Math.max(0, yScale(y1));
  const centerRadius = innerRadius + (outerRadius - innerRadius) / 2;

  const centerX = centerRadius * Math.cos(centerAngle);
  const centerY = centerRadius * Math.sin(centerAngle);
  const centroid: Origin = { x: centerX, y: centerY };

  const length = (endAngle - startAngle) * centerRadius;
  const width = outerRadius - innerRadius;
  const display = textDisplay(node, path, length, width);

  return { startAngle, endAngle, innerRadius, outerRadius, length, width, centroid, display };
};
