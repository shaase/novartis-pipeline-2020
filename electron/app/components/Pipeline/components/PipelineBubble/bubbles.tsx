import React, { MutableRefObject } from "react";
import { Bubble } from "../../types";
import BubbleLabel from "./bubble-label";
import styles from "./index.module.scss";

type Props = {
  items: Bubble[];
  path: string;
  svgClass: string;
  width: number;
  height: number;
  refGroup: MutableRefObject<SVGGElement | null>;
  refCircle: MutableRefObject<SVGCircleElement | null>;
  onSelect: (b: Bubble) => void;
};

const Bubbles: React.FC<Props> = ({ items, svgClass, width, height, path, refGroup, refCircle, onSelect }: Props) => (
  <svg width={width} height={height} fontFamily="sans-serif" fontSize="10" textAnchor="middle" className={svgClass}>
    {React.Children.toArray(
      items.map((b: Bubble) => (
        <g className={styles.node} ref={refGroup}>
          {b.id !== "hidden" && (
            <circle
              id={b.id}
              stroke="rgba(255,0,0,0)"
              strokeWidth={6}
              fill={b.fill}
              className={styles.circle}
              ref={refCircle}
              onClick={() => {
                onSelect(b);
              }}
            />
          )}

          {b.r / width > 0.09 && b.id !== "hidden" && (
            <BubbleLabel title={`${b.id} [${b.value}]`} path={path} color={b.color} containerWidth={b.r + 6} />
          )}
        </g>
      )),
    )}
  </svg>
);

export default Bubbles;
