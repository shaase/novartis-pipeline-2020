import React, { useEffect, useRef } from "react";
import { arc, DefaultArcObject } from "d3-shape";
import { scaleLinear, scaleSqrt } from "d3-scale";
import { RadialNode, NodeLabel, CurvePosition, NodeLabelLine } from "../../../types";
import { itemsForPath } from "../../../utils";
import { subscribe, unsubscribe, xScale, yScale } from "../RadialChart/radial-state";
import WrappedLabel from "./wrapped-label";
import lineRotation from "./line-rotation";
import lineOffset from "./line-offset";
import sizedText from "./sized-text";
import { getTextDisplay } from "./text-display";
import { getArcLength, getArcWidth } from "./arc-sizes";
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
};

const arcLength = (node: RadialNode): number => getArcLength(node, xScale, yScale);
const arcWidth = (node: RadialNode): number => getArcWidth(node, yScale);
const textDisplay = (node: RadialNode, path: string): string => getTextDisplay(node, path, arcLength, arcLength);

const getPosition = (node: RadialNode): CurvePosition => {
  const start = Math.max(0, Math.min(2 * Math.PI, xScale(node.x0 || 0)));
  const end = Math.max(0, Math.min(2 * Math.PI, xScale(node.x1 || 0)));
  const s = end - start;
  const center = start + s / 2;
  const isUnder = center > 1.57 && center < 4.71;
  return { start, end, center, size: s, isUnder };
};

const RadialLabels: React.FC<Props> = ({ path, canvasSize, nodes, xDomain, xRange }: Props) => {
  const { root: pathRoot } = itemsForPath(path);
  const nodesRef = useRef<RadialNode[]>([]);

  if (nodesRef.current !== nodes) {
    nodesRef.current = nodes;
  }

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

  // console.log(labels);

  const onInterpolation = (): void => {
    // const labels: NodeLabel[] = nodesRef.current.map((node: RadialNode) => {
    //   const { name, route, color, textOpacity: opacity } = node;
    //   const length = arcLength(node);
    //   const width = arcWidth(node);
    //   const display = textDisplay(node, path);
    //   // const isCurved = display.includes("curved");
    //   // const w = isCurved ? length - 6 : width - 7;
    //   // const height = isCurved ? width : length;
    //   // const { lines: l, fontSize, offsets } = sizedText({
    //   //   path,
    //   //   display,
    //   //   route,
    //   //   name,
    //   //   width: w,
    //   //   height,
    //   // });
    //   // const lines: NodeLabelLine[] = l.map((elements: JSX.Element | JSX.Element[], index: number) => {
    //   //   const id = `${elements}-${index}`;
    //   //   const curve = getLabelCurve(node, index, l.length, fontSize);
    //   //   const anchor = getLabelAnchor(node, index);
    //   //   const transform = getLabelTransform(node, index, l.length, fontSize);
    //   //   return { id, elements, curve, anchor, transform };
    //   // });
    //   return { display, color: "#000000", opacity, lines: [], fontSize: 18, offsets: [] };
    // });
    console.log(nodesRef);
  };

  useEffect(() => {
    subscribe(onInterpolation);

    return () => {
      unsubscribe(onInterpolation);
    };
  }, []);

  return (
    <svg width={canvasSize} height={canvasSize} className={styles.container}>
      {/* {React.Children.toArray(labels.map((label: NodeLabel) => <WrappedLabel label={label} />))} */}
    </svg>
  );
};

export default RadialLabels;
