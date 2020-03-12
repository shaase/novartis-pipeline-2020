import React from "react";
import { ScaleLinear, ScalePower, scaleLinear, scaleSqrt } from "d3-scale";
import { arc, DefaultArcObject } from "d3-shape";
import { RadialNode, NodeLabel, CurvePosition, NodeLabelLine } from "../../../types";
import { itemsForPath } from "../../../utils";
import WrappedLabel from "./wrapped-label";
import lineRotation from "./line-rotation";
import lineOffset from "./line-offset";
import sizedText from "./sized-text";
import { getTextDisplay } from "./text-display";
import styles from "./index.module.scss";

interface Arc extends DefaultArcObject {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

type Origin = { x: number; y: number };

type Props = {
  path: string;
  canvasSize: number;
  nodes: RadialNode[];
  xDomain: number[];
  xRange: number[];
  yDomain: number[];
  yRange: number[];
  xScale: ScaleLinear<number, number>;
  yScale: ScalePower<number, number>;
};

const RadialLabels: React.FC<Props> = ({
  path,
  canvasSize,
  nodes,
  xDomain,
  xRange,
  yDomain,
  yRange,
  xScale,
  yScale,
}: Props) => {
  const { root: pathRoot } = itemsForPath(path);

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

  const getArcLength = (node: RadialNode): number => {
    const { x0 = 0, x1 = 0, y0 = 0, y1 = 0 } = node;

    const nextXScale = scaleLinear()
      .domain(xDomain)
      .range(xRange);

    const nextYScale = scaleSqrt()
      .domain(yDomain)
      .range(yRange);

    const start = Math.max(0, Math.min(2 * Math.PI, nextXScale(x0)));
    const end = Math.max(0, Math.min(2 * Math.PI, nextXScale(x1)));
    const inner = nextYScale(y0);
    const outer = nextYScale(y1);
    const radius = inner + (outer - inner) / 2;
    const radians = end - start;
    const arcLength = radians * radius;

    return arcLength;
  };

  const getArcWidth = (node: RadialNode): number => {
    const { y0 = 0, y1 = 0 } = node;

    const nextYScale = scaleSqrt()
      .domain(yDomain)
      .range(yRange);

    const arcWidth = nextYScale(y1) - nextYScale(y0);

    return arcWidth;
  };

  const getCentroid = (node: RadialNode, alignment: string, isRight: boolean): Origin => {
    const { y0 = 0 } = node;
    let { y1 } = node;
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

  const getLabelAnchor = (node: RadialNode, lines: number): string => {
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

  const getLabelTransform = (node: RadialNode, index: number, length: number, fontSize: number): string => {
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

  const getTextDisplay = (node: RadialNode): string => textDisplay(node, path, getArcLength, getArcWidth);

  const visibleNodes = nodes.filter((node: RadialNode) => getTextDisplay(node) !== "none");
  const labels: NodeLabel[] = visibleNodes.map((node: RadialNode) => {
    const { name, route, color, textOpacity: opacity } = node;

    const display = getTextDisplay(node);
    const arcLength = getArcLength(node);
    const arcWidth = getArcWidth(node);
    const isCurved = display.includes("curved");
    const w = isCurved ? arcLength - 6 : arcWidth - 7;
    const height = isCurved ? arcWidth : arcLength;
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
      const curve = getLabelCurve(node, index, l.length, fontSize);
      const anchor = getLabelAnchor(node, index);
      const transform = getLabelTransform(node, index, l.length, fontSize);

      return { id, elements, curve, anchor, transform };
    });

    return { display, color: "#FF0000", opacity, lines, fontSize, offsets };
  });

  // console.log(labels);

  return (
    <svg width={canvasSize} height={canvasSize} className={styles.container}>
      {React.Children.toArray(labels.map((label: NodeLabel) => <WrappedLabel label={label} />))}
    </svg>
  );
};

export default RadialLabels;
