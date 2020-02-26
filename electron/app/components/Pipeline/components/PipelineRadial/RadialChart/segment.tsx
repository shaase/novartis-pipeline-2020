import React, { useMemo, useRef } from "react";
import { animated } from "react-spring/renderprops";
import { itemsForPath } from "../../../utils";
import { lightenColor } from "./utils";
import { RadialNode } from "../../../types";
import WrappedLabel from "./WrappedLabel";
import styles from "./index.module.scss";

const flattenToSubtypes = (list: RadialNode[]): RadialNode[] =>
  list.reduce(
    (a: RadialNode[], b: RadialNode) =>
      a.concat(
        (b.children || [])[0].depth === 6
          ? (b.children || []).filter((child: RadialNode) => child.name !== "*")
          : flattenToSubtypes(b.children || []),
      ),
    [],
  );

type Props = {
  original: RadialNode;
  index: number;
  t: any; // eslint-disable-line
  path: string;
  nct: string;
  getArc: (node: RadialNode) => void;
  labelCurve: (node: RadialNode, index: number, length: number, fontSize: number) => string;
  labelAnchor: (node: RadialNode, lines: number) => string;
  getDisplay: (node: RadialNode) => string;
  getTextDisplay: (node: RadialNode) => string;
  getArcLength: (node: RadialNode) => number;
  getArcWidth: (node: RadialNode) => number;
  labelTransform: (node: RadialNode, index: number, length: number, fontSize: number) => string;
  onSelect: (node: RadialNode) => void;
};

const SunburstSegment: React.FC<Props> = ({
  original,
  index,
  t,
  path,
  nct,
  getArc,
  labelCurve,
  labelTransform,
  labelAnchor,
  getDisplay,
  getTextDisplay,
  getArcLength,
  getArcWidth,
  onSelect,
}: Props) => {
  const { root: pathRoot } = itemsForPath(path);
  const lengthRef = useRef(0);
  if (original.x0 === undefined) return null;

  let node: RadialNode = original;
  const { parent, phase, isEmpty, depth, route } = node;
  let name = node.name || "";
  if (name === "Immune Thrombocytopenic Purpura") {
    name = "Immune Thrombo... Purpura";
  }

  const textDisplay = getTextDisplay(node);
  let opacity = 1;
  let lighten = nct !== "";

  if (nct !== "" && node.isStudyContainer) {
    const filtered =
      node.children === undefined ? [] : node.children.filter((child: RadialNode) => child.label === nct);

    lighten = filtered.length === 0;
  }

  if (pathRoot === "Compounds") {
    lighten = false;
  }

  if (phase !== undefined) {
    const dist = (node.y1 || 0) - (node.y0 || 0);
    if (nct !== "") {
      const filtered = (node.parent.children || []).filter((child: RadialNode) => child.label === nct);

      if (pathRoot !== "Compounds") {
        lighten = filtered.length === 0;
      }
    }

    let length = dist;
    if (phase === 1) {
      opacity = 0.3;
      length *= 0.24;
    } else if (phase === 1.5) {
      opacity = 0.45;
      length *= 0.475;
    } else if (phase === 2) {
      opacity = 0.65;
      length *= 0.75;
    } else if (phase === 3) {
      opacity = 0.8;
    }

    const y1 = (node.y0 || 0) + length;
    node = { ...node, y1 };
  } else if (parent !== null) {
    if (isEmpty) {
      node = { ...node, y0: 0, y1: 0 };
    } else if (parent.isEmpty) {
      let { y0 } = parent;

      if ((route.includes("Malignant/B-cell") || route.includes("Malignant/Blastic")) && depth === 7) {
        ({ y0 } = parent.parent.parent);
      }

      node = { ...node, y0 };
    }
  }

  let textOpacity = 1;

  if (pathRoot === "Compounds" && node.isStudyContainer && depth === 5) {
    const flattened = flattenToSubtypes(parent.children || []);
    if (flattened.length === 0) {
      const { y1 } = (node.children || [])[0];
      node = { ...node, y1 };
    }
  } else if (pathRoot === "Compounds" && node.isStudyContainer && depth === 6) {
    const flattened = flattenToSubtypes(parent.parent.children || []);
    if (flattened.length === 0) {
      node = { ...node, y0: node.y1 };
    }
    textOpacity = 0.8;
  }

  const arcLength = getArcLength(node);
  const arcWidth = getArcWidth(node);
  const isCurved = textDisplay.includes("curved");
  const containerWidth = isCurved ? arcLength - 6 : arcWidth - 7;
  const containerHeight = isCurved ? arcWidth : arcLength;

  const childElements = useMemo(
    () => (
      <g key={`node-${index}`}>
        <animated.path
          className={styles.path}
          stroke="#FFFFFF"
          strokeWidth={0.5}
          fill={node.fill}
          fillRule="evenodd"
          opacity={opacity}
          onClick={() => {
            if (node.route !== undefined) {
              onSelect(node);
            }
          }}
          display={t.interpolate(() => getDisplay(node))}
          d={t.interpolate(() => {
            if (node.route.includes("/*/*/Lung") && node.name === "Lung") {
              // console.log(getArc(node));
            }

            return getArc(node);
          })}
        />

        {textDisplay !== "none" && (
          <WrappedLabel
            path={path}
            display={textDisplay}
            node={node}
            name={name}
            t={t}
            index={index}
            opacity={textOpacity}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            labelTransform={labelTransform}
            labelAnchor={labelAnchor}
            labelCurve={labelCurve}
          />
        )}

        {lighten && (
          <animated.path
            className={styles.fader}
            stroke="#FFFFFF"
            strokeWidth={0.4}
            fill="#DDDDDD"
            fillRule="evenodd"
            opacity={0.7}
            display={t.interpolate(() => getDisplay(node))}
            d={t.interpolate(() => getArc(node))}
          />
        )}
      </g>
    ),
    [arcLength],
  );

  return <g>{childElements}</g>;
};

export default SunburstSegment;
