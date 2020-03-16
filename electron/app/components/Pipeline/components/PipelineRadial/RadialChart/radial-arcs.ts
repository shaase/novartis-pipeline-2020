import { ScaleLinear, ScalePower } from "d3-scale";
import { RadialNode, NodeArc, LabelArc, FormattedText } from "../../../types";
import { hexToRgbArray, lighten } from "../../../utils";
import { textDisplay } from "./labels/text-display";

export const nodeArc = (
  node: RadialNode,
  width: number,
  xScale: ScaleLinear<number, number>,
  yScale: ScalePower<number, number>,
): NodeArc => {
  const { x0 = 0, x1 = 0, y0 = 0, y1 = 0, opacity = 1 } = node;
  const startAngle = Math.max(0, Math.min(2 * Math.PI, xScale(x0)));
  const endAngle = Math.max(0, Math.min(2 * Math.PI, xScale(x1)));
  let innerRadius = Math.max(0, yScale(y0)) - 2;
  const outerRadius = Math.max(0, yScale(y1));
  const diff = outerRadius - innerRadius;
  if (diff > 4 && diff < 20) innerRadius -= 10;

  const theta = [startAngle, endAngle];
  const radius = [innerRadius / width, outerRadius / width];
  const color = hexToRgbArray(node.fill || "#FFFFFF");
  const alpha = opacity;

  return { theta, radius, color, alpha };
};

export const btnArc = (
  node: RadialNode,
  width: number,
  xScale: ScaleLinear<number, number>,
  yScale: ScalePower<number, number>,
): NodeArc => {
  const { theta, radius } = nodeArc(node, width, xScale, yScale);
  const { rgbArray } = node;
  const color = [rgbArray[0] / 255, rgbArray[1] / 255, 0];
  const alpha = 1;

  return { theta, radius, color, alpha };
};

export const labelArc = (
  node: RadialNode,
  path: string,
  xScale: ScaleLinear<number, number>,
  yScale: ScalePower<number, number>,
): LabelArc => {
  const { x0 = 0, x1 = 0, y0 = 0, y1 = 0, formattedName, parent, route } = node;
  let parentWidth = 0;

  if (parent !== null && parent.isEmpty) {
    const parentArc = labelArc(parent, path, xScale, yScale);
    parentWidth = parentArc.width;
  }

  const startAngle = Math.max(0, Math.min(2 * Math.PI, xScale(x0))) - Math.PI / 2;
  const endAngle = Math.max(0, Math.min(2 * Math.PI, xScale(x1))) - Math.PI / 2;
  const centerAngle = startAngle + (endAngle - startAngle) / 2;
  const innerRadius = Math.max(0, yScale(y0)) * window.devicePixelRatio;
  const outerRadius = Math.max(0, yScale(y1)) * window.devicePixelRatio;
  const centerRadius = innerRadius + (outerRadius - innerRadius) / 2;
  const length = ((endAngle - startAngle) * centerRadius) / window.devicePixelRatio;
  const width = (outerRadius - innerRadius) / window.devicePixelRatio;
  const display = textDisplay(node, path, length, width, parentWidth);
  const color = node.color || "#FF0000";

  return {
    formattedName,
    route,
    startAngle,
    endAngle,
    centerAngle,
    innerRadius,
    outerRadius,
    centerRadius,
    length,
    width,
    display,
    color,
  };
};

export const selectedArc = (
  node: RadialNode,
  width: number,
  xScale: ScaleLinear<number, number>,
  yScale: ScalePower<number, number>,
): NodeArc => {
  const { theta, radius, alpha } = nodeArc(node, width, xScale, yScale);
  const color = hexToRgbArray(lighten(node.fill || "#FFFFFF", 0.4));

  return { theta, radius, color, alpha };
};
