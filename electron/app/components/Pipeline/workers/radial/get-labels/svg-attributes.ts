import { arc, DefaultArcObject } from "d3-shape";
import { ScaleLinear, ScalePower, scaleLinear, scaleSqrt } from "d3-scale";
import { RadialNode, CurvePosition, SVGAttributes } from "../../../types";
import lineRotation from "./line-rotation";
import lineOffset from "../../../components/PipelineRadial/RadialLabels/line-offset";

let xScale = scaleLinear();
let yScale = scaleSqrt();
let xDomain: number[] = [];
let xRange: number[] = [];

type Origin = { x: number; y: number };

const getArc = arc()
  .startAngle((d: any) => Math.max(0, Math.min(2 * Math.PI, xScale(d.x0))))
  .endAngle((d: any) => Math.max(0, Math.min(2 * Math.PI, xScale(d.x1))))
  .innerRadius((d: any) => Math.max(0, yScale(d.y0)))
  .outerRadius((d: any) => Math.max(0, yScale(d.y1)));

const getCurve = arc()
  .startAngle((d: any) => Math.max(0, Math.min(2 * Math.PI, xScale(d.x0))))
  .endAngle((d: any) => Math.max(0, Math.min(2 * Math.PI, xScale(d.x1))))
  .outerRadius((d: any) => Math.max(0, d.m));

const getUnderCurve = arc()
  .startAngle((d: any) => Math.max(0, Math.min(2 * Math.PI, xScale(d.x1))))
  .endAngle((d: any) => Math.max(0, Math.min(2 * Math.PI, xScale(d.x0))))
  .outerRadius((d: any) => Math.max(0, d.m));

const getCentroid = (node: RadialNode, alignment: string, isRight: boolean): Origin => {
  const { y0 = 0 } = node;
  let { y1 = 0 } = node;
  const mod = isRight ? 0.01 : 0.005;

  if (alignment === "inside") {
    y1 = y0 + mod;
  }

  const xNode = { ...node, y1 };
  const centroid = getArc.centroid(xNode);

  const x = Number.isNaN(centroid[0]) ? 0 : centroid[0];
  const y = Number.isNaN(centroid[1]) ? 0 : centroid[1];
  return { x, y };
};

const getPosition = (node: RadialNode): CurvePosition => {
  const start = Math.max(0, Math.min(2 * Math.PI, xScale(node.x0 || 0)));
  const end = Math.max(0, Math.min(2 * Math.PI, xScale(node.x1 || 0)));
  const s = end - start;
  const center = start + s / 2;
  const isUnder = center > 1.57 && center < 4.71;
  return { start, end, center, size: s, isUnder };
};

const getNextPosition = (node: RadialNode): CurvePosition => {
  const { x0, x1 } = node;

  const nextXScale = scaleLinear()
    .domain(xDomain)
    .range(xRange);

  const start = Math.max(0, Math.min(2 * Math.PI, nextXScale(x0 || 0)));
  const end = Math.max(0, Math.min(2 * Math.PI, nextXScale(x1 || 0)));
  const size = end - start;
  const center = start + size / 2;
  const isUnder = center > 1.57 && center < 4.71;
  return { start, end, center, size, isUnder };
};

const getLabelCurve = (node: RadialNode, index: number, length: number, fontSize: number): string => {
  const { y0 = 0, y1 = 0 } = node;
  const inner = yScale(y0);
  const outer = yScale(y1);

  const { isUnder } = getPosition(node);
  const yOffset = lineOffset(index, length, fontSize, isUnder);

  const mid = inner + (outer - inner) / 2;
  const m = mid + yOffset;
  const nMid = { ...node, m };
  const curve = isUnder ? getUnderCurve(nMid) : getCurve(nMid);
  return curve.replace("LNaN,NaNZ", "");
};

const getLabelAnchor = (node: RadialNode, pathRoot: string, lines: number): string => {
  if (lines === 1 && !node.isStudyContainer) {
    return "middle";
  }

  if (pathRoot === "Compounds" && node.depth === 4) {
    return "middle";
  }

  const { center } = getNextPosition(node);
  const isRight = center < Math.PI;
  return isRight ? "start" : "end";
};

const getLabelTransform = (
  node: RadialNode,
  pathRoot: string,
  index: number,
  length: number,
  fontSize: number,
): string => {
  const { start, end } = getPosition(node);
  const { center } = getNextPosition(node);

  if (Number.isNaN(start)) {
    return "translate(0, 0) rotate(-90) rotate(0)";
  }

  const isRight = center < Math.PI;
  const rDiff = lineRotation(index, length, fontSize, start, end, isRight);

  let alignment = length === 1 && !node.isStudyContainer ? "center" : "inside";

  if (pathRoot === "Compounds" && node.depth === 4) {
    alignment = "center";
  }

  const { x, y } = getCentroid(node, alignment, isRight);
  const rot = center < Math.PI ? rDiff : rDiff + Math.PI;
  const style = `translate(${x}, ${y}) rotate(-90) rotate(${(rot * 180) / Math.PI})`;
  return style;
};

export const updateDomain = (
  xScale0: ScaleLinear<number, number>,
  yScale0: ScalePower<number, number>,
  xDomain0: number[],
  xRange0: number[],
): void => {
  xScale = xScale0;
  yScale = yScale0;
  xDomain = xDomain0;
  xRange = xRange0;
};

export const getAttributes = (
  node: RadialNode,
  pathRoot: string,
  index: number,
  length: number,
  fontSize: number,
): SVGAttributes => {
  const curve = getLabelCurve(node, index, length, fontSize);
  const anchor = getLabelAnchor(node, pathRoot, length);
  const transform = getLabelTransform(node, pathRoot, index, length, fontSize);

  return { curve, anchor, transform };
};
