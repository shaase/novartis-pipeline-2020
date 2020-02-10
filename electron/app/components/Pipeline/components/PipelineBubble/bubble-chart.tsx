import React, { useEffect, useRef } from "react";
import { TweenMax } from "gsap";
import { Bubble } from "../../types";
import { itemsForPath } from "../../utils";
import Bubbles from "./bubbles";
import styles from "./index.module.scss";

type Props = {
  isVisible: boolean;
  bubbles: Bubble[];
  path: string;
  width: number;
  height: number;
  marginLeft: number;
  onNavigate: (definedPath: string, definedCompound?: string, idling?: boolean) => void;
};

const BubbleChart: React.FC<Props> = ({ isVisible, bubbles, path, width, height, marginLeft, onNavigate }: Props) => {
  const groups = useRef<SVGGElement[]>([]);
  const circles = useRef<SVGGElement[]>([]);

  const handleSelect = (node: Bubble): void => {
    const { root, level } = itemsForPath(node.path);
    const compound = (root === "Compounds" && level === 3) || (root === "Tumors" && level === 7) ? node.id : undefined;
    onNavigate(node.path, compound);
  };

  useEffect(() => {
    bubbles.forEach(({ x, y, r }, i) => {
      if (groups.current[i] !== undefined && circles.current[i] !== undefined) {
        const opacity = r === 0 ? 0 : 1;
        TweenMax.to(groups.current[i], 0.4, { x, y, opacity });
        TweenMax.to(circles.current[i], 0.4, { attr: { r } });
      }
    });
  });

  const addGroup = (el: SVGGElement | null): void => {
    if (el !== null && groups.current.length < 50) {
      groups.current.push(el);
      TweenMax.to(el, 0, { x: 250, y: 400, opacity: 0 });
    }
  };

  const addCircle = (el: SVGCircleElement | null): void => {
    if (el !== null) {
      circles.current.push(el);
    }
  };

  return (
    <div className={isVisible ? styles.bubbles : styles.bubblesHidden} style={{ marginLeft }}>
      <Bubbles
        items={bubbles}
        svgClass={styles.svg}
        path={path}
        width={width}
        height={height}
        refGroup={addGroup}
        refCircle={addCircle}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default BubbleChart;
