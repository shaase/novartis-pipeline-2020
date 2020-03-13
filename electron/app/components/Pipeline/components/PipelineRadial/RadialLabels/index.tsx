import React, { useEffect, useRef } from "react";
import { interpolate as d3interpolate } from "d3-interpolate";
import { RadialNode, NodeLabel } from "../../../types";
// import { subscribe, unsubscribe } from "../RadialChart/radial-state";
import styles from "./index.module.scss";

type Props = { size: number; labels: NodeLabel[] };

const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number): void => {
  const words = text.split(" ");
  let line = "";
  const lineHeight = 18 * 1.286; // a good approx for 10-18px sizes

  context.font = "18px sans-serif";
  context.textBaseline = "top";

  for (let n = 0; n < words.length; n += 1) {
    const testLine = `${line + words[n]} `;
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth) {
      context.fillText(line, x, y);
      if (n < words.length - 1) {
        line = `${words[n]} `;
        y += lineHeight;
      }
    } else {
      line = testLine;
    }
  }

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#FFFFFF";
  context.fillText(line, x, y);
};

const RadialLabels: React.FC<Props> = ({ size, labels }: Props) => {
  const labelsRef = useRef<NodeLabel[]>([]);
  const canvas = useRef<HTMLCanvasElement | null>(null);

  const onInterpolation = (nodes: RadialNode): void => {
    if (canvas.current !== null) {
      const context = canvas.current.getContext("2d");
      if (context !== null) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.beginPath();

        labelsRef.current.forEach((label: NodeLabel) => {
          const { node, startArc, endArc } = label;
          const ad = d3interpolate(startArc, endArc);
          const iArc = ad(i);
          const { startAngle, centerRadius, length } = iArc;
          const x = 789 + centerRadius * Math.cos(startAngle);
          const y = 789 + centerRadius * Math.sin(startAngle);

          // if (node.name === "Leukemia") {
          //   console.log(x, y);
          //   // wrapText(context, node.name, 1100, 450, length);
          //   wrapText(context, node.name, 789, 789, length);
          // } else if (iArc.width > 10 && iArc.length > 10) {
          //   wrapText(context, node.name, x, y, length);
          // }

          if (iArc.width > 10 && iArc.length > 10) {
            if (node.name === "Breast") {
              // console.log(startAngle + Math.PI / 2);
              // console.log(i, startArc.startAngle, endArc.startAngle, iArc.startAngle);
              wrapText(context, node.name, x, y, length);
            }
          }
        });
      }
    }
  };

  if (labelsRef.current !== labels) {
    labelsRef.current = labels;
  }

  useEffect(
    () =>
      // subscribe(onInterpolation);
      () => {
        // unsubscribe(onInterpolation);
      },
    [],
  );

  return <canvas className={styles.canvas} width={size} height={size} ref={canvas} />;
};

export default RadialLabels;
