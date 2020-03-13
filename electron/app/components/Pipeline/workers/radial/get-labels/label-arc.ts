import { ScaleLinear, ScalePower } from "d3-scale";
import { RadialNode, RadialArc } from "../../../types";
import { textDisplay } from "./text-display";

export const labelArc = (
  node: RadialNode,
  path: string,
  xScale: ScaleLinear<number, number>,
  yScale: ScalePower<number, number>,
): RadialArc => {
  const { x0 = 0, x1 = 0, y0 = 0, y1 = 0 } = node;
  const startAngle = Math.max(0, Math.min(2 * Math.PI, xScale(x0))) - Math.PI / 2;
  const endAngle = Math.max(0, Math.min(2 * Math.PI, xScale(x1))) - Math.PI / 2;
  const centerAngle = startAngle + (endAngle - startAngle) / 2;

  // window.devicePixelRatio
  const innerRadius = Math.max(0, yScale(y0)) * window.devicePixelRatio;
  const outerRadius = Math.max(0, yScale(y1)) * window.devicePixelRatio;
  const centerRadius = innerRadius + (outerRadius - innerRadius) / 2;

  const length = ((endAngle - startAngle) * centerRadius) / window.devicePixelRatio;
  const width = (outerRadius - innerRadius) / window.devicePixelRatio;
  const display = textDisplay(node, path, length, width);

  if (node.route === "Content/Tumors/Heme/Malignant/Leukemia") {
    // need to set at 789,789

    console.log(length, width);
  }

  return {
    startAngle,
    endAngle,
    centerAngle,
    innerRadius,
    outerRadius,
    centerRadius,
    length,
    width,
    display,
  };
};

// const getCentroid = (node: RadialNode, alignment: string, isRight: boolean): Origin => {
//   const { y0 = 0 } = node;
//   let { y1 = 0 } = node;
//   const mod = isRight ? 0.01 : 0.005;

//   if (alignment === "inside") {
//     y1 = y0 + mod;
//   }

//   const xNode = { ...node, y1 };
//   const centroid = getArc.centroid(xNode);

//   const x = Number.isNaN(centroid[0]) ? 0 : centroid[0];
//   const y = Number.isNaN(centroid[1]) ? 0 : centroid[1];
//   return { x, y };
// };
