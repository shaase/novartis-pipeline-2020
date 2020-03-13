import React, { useEffect, useRef, useState } from "react";
import { NodeLabel, NodeLabelLine } from "../../../types";
import { itemsForPath } from "../../../utils";
import { subscribe, unsubscribe, xScale, yScale } from "../RadialChart/radial-state";
import WrappedLabel from "./wrapped-label";
import sizedText from "./sized-text";
import { labelCurve, labelAnchor, labelTransform } from "./svg-attributes";
import styles from "./index.module.scss";

type Props = { path: string; canvasSize: number; labels: NodeLabel[] };

const RadialLabels: React.FC<Props> = ({ path, canvasSize, labels }: Props) => {
  const { root: pathRoot } = itemsForPath(path);
  const labelsRef = useRef<NodeLabel[]>([]);
  const [sizedLabels, setSizedLabels] = useState<NodeLabel[]>([]);

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

      const lines: NodeLabelLine[] = l.map((elements: JSX.Element | JSX.Element[], index: number) => {
        const id = `${elements}-${index}`;
        const curve = labelCurve(label, 0, index, length, fontSize);
        const anchor = labelAnchor(label, pathRoot, length);
        const transform = labelTransform(label, 0, index, length, fontSize);
        return { id, elements, curve, anchor, transform };
      });

      return { ...label, lines, fontSize, offsets };
    });

    setSizedLabels(arr);
  }

  useEffect(() => {
    // subscribe(onInterpolation);
    // return () => {
    //   unsubscribe(onInterpolation);
    // };
  }, []);

  return (
    <svg width={canvasSize} height={canvasSize} className={styles.container}>
      {React.Children.toArray(sizedLabels.map((label: NodeLabel) => <WrappedLabel label={label} />))}
    </svg>
  );
};

export default RadialLabels;
