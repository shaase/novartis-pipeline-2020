import React, { useEffect, useRef } from "react";
import { NodeLabel, NodeLabelLine } from "../../../types";
import { subscribe, unsubscribe, xScale, yScale } from "../RadialChart/radial-state";
import WrappedLabel from "./wrapped-label";
import sizedText from "./sized-text";
import { labelCurve, labelAnchor, labelTransform } from "./svg-attributes";
import styles from "./index.module.scss";

type Props = { path: string; canvasSize: number; labels: NodeLabel[] };

const RadialLabels: React.FC<Props> = ({ path, canvasSize, labels }: Props) => {
  const labelsRef = useRef<NodeLabel[]>([]);

  if (labelsRef.current !== labels) {
    labelsRef.current = labels;

    const arr: NodeLabel[] = labelsRef.current.map((label: NodeLabel) => {
      const { node, display, endArc } = label;

      const { name, route } = node;
      const { length, width } = endArc;
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

      // const lines: NodeLabelLine[] = l.map((elements: JSX.Element | JSX.Element[], index: number) => {
      //   const id = `${elements}-${index}`;
      //   const curve = labelCurve(node, index, l.length, fontSize);
      //   const anchor = labelAnchor(node, index);
      //   const transform = labelTransform(node, index, l.length, fontSize);
      //   return { id, elements, curve, anchor, transform };
      // });

      return { ...label, lines: l, fontSize, offsets };
    });

    // console.log(arr);
  }

  // const labels: NodeLabel[] = nodes.map((node: RadialNode) => {
  //   const { textOpacity: opacity } = node;
  //   const startArc = labelArc(node, path, prevXScale, prevYScale);
  //   const endArc = labelArc(node, path, xScale, yScale);
  //   const { display } = endArc;

  //   return { node, display, color: "#000000", opacity, startArc, endArc };
  // });

  // const onInterpolation = (): void => {
  //   console.log("interpolate");
  // };

  useEffect(() => {
    // subscribe(onInterpolation);
    // return () => {
    //   unsubscribe(onInterpolation);
    // };
  }, []);

  return (
    <svg width={canvasSize} height={canvasSize} className={styles.container}>
      {/* {React.Children.toArray(labels.map((label: NodeLabel) => <WrappedLabel label={label} />))} */}
    </svg>
  );
};

export default RadialLabels;
