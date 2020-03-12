import React, { useEffect, useRef } from "react";
import { arc, DefaultArcObject } from "d3-shape";
import { scaleLinear, scaleSqrt } from "d3-scale";
import { RadialNode, NodeLabel, CurvePosition } from "../../../types";
import { itemsForPath } from "../../../utils";
import { subscribe, unsubscribe, xScale, yScale } from "../RadialChart/radial-state";
import WrappedLabel from "./wrapped-label";
import lineRotation from "./line-rotation";
import lineOffset from "./line-offset";
import sizedText from "./sized-text";
import { getTextDisplay } from "./text-display";
import { getArcLength, getArcWidth } from "./arc-sizes";
import styles from "./index.module.scss";

type Props = { path: string; canvasSize: number; labels: NodeLabel[][] };

const RadialLabels: React.FC<Props> = ({ path, canvasSize, labels }: Props) => {
  const { root: pathRoot } = itemsForPath(path);
  const labelsRef = useRef<NodeLabel[][]>([]);

  if (labelsRef.current !== labels) {
    labelsRef.current = labels;
  }

  const onInterpolation = (): void => {
    // const labels: NodeLabel[] = nodesRef.current.map((node: RadialNode) => {
    //   const { name, route, color, textOpacity: opacity } = node;
    //   const length = arcLength(node);
    //   const width = arcWidth(node);
    //   const display = textDisplay(node, path);
    //   const isCurved = display.includes("curved");
    //   const w = isCurved ? length - 6 : width - 7;
    //   const height = isCurved ? width : length;
    //   const { lines: l, fontSize, offsets } = sizedText({
    //     path,
    //     display,
    //     route,
    //     name,
    //     width: w,
    //     height,
    //   });
    //   const lines: NodeLabelLine[] = l.map((elements: JSX.Element | JSX.Element[], index: number) => {
    //     const id = `${elements}-${index}`;
    //     const curve = getLabelCurve(node, index, l.length, fontSize);
    //     const anchor = getLabelAnchor(node, index);
    //     const transform = getLabelTransform(node, index, l.length, fontSize);
    //     return { id, elements, curve, anchor, transform };
    //   });
    //   return { display, color: "#000000", opacity, lines, fontSize, offsets };
    // });
  };

  useEffect(() => {
    subscribe(onInterpolation);

    return () => {
      unsubscribe(onInterpolation);
    };
  }, []);

  return (
    <svg width={canvasSize} height={canvasSize} className={styles.container}>
      {React.Children.toArray(labels.map((label: NodeLabel) => <WrappedLabel label={label} />))}
    </svg>
  );
};

export default RadialLabels;
