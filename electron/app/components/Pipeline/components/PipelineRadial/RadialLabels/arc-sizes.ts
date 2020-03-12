import { ScaleLinear, ScalePower } from "d3-scale";
import { RadialNode } from "../../../types";

export const getArcLength = (
  node: RadialNode,
  xScale: ScaleLinear<number, number>,
  yScale: ScalePower<number, number>,
): number => {
  const { x0 = 0, x1 = 0, y0 = 0, y1 = 0 } = node;
  const start = Math.max(0, Math.min(2 * Math.PI, xScale(x0)));
  const end = Math.max(0, Math.min(2 * Math.PI, xScale(x1)));
  const inner = yScale(y0);
  const outer = yScale(y1);
  const radius = inner + (outer - inner) / 2;
  const radians = end - start;

  return radians * radius;
};

export const getArcWidth = (node: RadialNode, yScale: ScalePower<number, number>): number => {
  const { y0 = 0, y1 = 0 } = node;
  return yScale(y1) - yScale(y0);
};
