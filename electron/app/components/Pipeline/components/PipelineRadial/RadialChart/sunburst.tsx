import React from "react";
import { Spring } from "react-spring/renderprops";
import { RadialNode, RootNode } from "../../../types";
import SunburstSegment from "./segment";
import emptyRing from "../../../../../images/pipeline/radial-empty.svg";
import phaseRing from "../../../../../images/pipeline/phase-ring.svg";
import styles from "./index.module.scss";

type Props = {
  isVisible: boolean;
  noData: boolean;
  path: string;
  nct: string;
  studies: number;
  width: number;
  height: number;
  root: RootNode;
  xd: (n: number) => void;
  yd: (n: number) => void;
  yr: (n: number) => void;
  getArc: (node: RadialNode) => void;
  labelCurve: (node: RadialNode, index: number, length: number, fontSize: number) => string;
  labelAnchor: (node: RadialNode, lines: number) => string;
  getDisplay: (node: RadialNode) => string;
  getTextDisplay: (node: RadialNode) => string;
  getArcLength: (node: RadialNode) => number;
  getArcWidth: (node: RadialNode) => number;
  labelTransform: (node: RadialNode, index: number, length: number, fontSize: number) => string;
  onSelect: (node: RadialNode) => void;
  onUpdate: (t: number, xd: (n: number) => void, yd: (n: number) => void, yr: (n: number) => void) => void;
};

const Sunburst: React.FC<Props> = ({
  isVisible,
  noData,
  width,
  height,
  root,
  xd,
  yd,
  yr,
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
  onUpdate,
  onSelect,
}: Props) => (
  <div className={styles.sunburst} style={{ display: isVisible ? "block" : "none" }}>
    <div className={styles.phaseContainer}>
      <img src={phaseRing} className={styles.phaseRing} alt="phase-ring" />
    </div>

    {noData ? (
      <img src={emptyRing} className={styles.empty} />
    ) : (
      <svg width={width} height={height} className={styles.shadow}>
        <Spring
          native
          reset
          from={{ t: 0 }}
          to={{ t: 1 }}
          onFrame={({ t }) => onUpdate(t, xd, yd, yr)}
          config={{ tension: 180, friction: 20 }}
        >
          {({ t }) => (
            <g transform={`translate(${width / 2}, ${height / 2})`}>
              {React.Children.toArray(
                root
                  .descendants()
                  .map((original: RadialNode, i: number) => (
                    <SunburstSegment
                      original={original}
                      index={i}
                      t={t}
                      path={path}
                      nct={nct}
                      getArc={getArc}
                      labelCurve={labelCurve}
                      labelTransform={labelTransform}
                      labelAnchor={labelAnchor}
                      getDisplay={getDisplay}
                      getTextDisplay={getTextDisplay}
                      getArcLength={getArcLength}
                      getArcWidth={getArcWidth}
                      onSelect={onSelect}
                    />
                  )),
              )}
            </g>
          )}
        </Spring>
      </svg>
    )}
  </div>
);

export default Sunburst;
