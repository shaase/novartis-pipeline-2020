import React from 'react';
import { Spring } from 'react-spring/renderprops';
import { RadialNode, RootNode } from '../../../types';
import SunburstSegment from './Segment';
import emptyRing from '../../../../../images/pipeline/radial-empty.svg';
import phaseRing from '../../../../../images/pipeline/phase-ring.svg';
import styles from './index.module.scss';

type Props = {
  isVisible: boolean,
  noData: boolean,
  path: string,
  nct: string,
  studies: number,
  width: number,
  height: number,
  root: RootNode,
  xd: number => void,
  yd: number => void,
  yr: number => void,
  getArc: RadialNode => void,
  labelCurve: (RadialNode, number, number, number) => string,
  labelAnchor: (RadialNode, number) => string,
  getDisplay: RadialNode => string,
  getTextDisplay: RadialNode => string,
  getArcLength: RadialNode => number,
  getArcWidth: RadialNode => number,
  labelTransform: (RadialNode, number, number, number) => string,
  onSelect: RadialNode => void,
  onUpdate: (
    number,
    (number) => void,
    (number) => void,
    (number) => void
  ) => void
};

const Sunburst = (props: Props) => {
  const {
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
    studies,
    getArc,
    labelCurve,
    labelTransform,
    labelAnchor,
    getDisplay,
    getTextDisplay,
    getArcLength,
    getArcWidth,
    onUpdate,
    onSelect
  } = props;
  return (
    <div
      className={styles.sunburst}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
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
                {root.descendants().map((original: RadialNode, i) => (
                  <SunburstSegment
                    key={i}
                    original={original}
                    index={i}
                    t={t}
                    path={path}
                    nct={nct}
                    studies={studies}
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
                ))}
              </g>
            )}
          </Spring>
        </svg>
      )}
    </div>
  );
};

export default Sunburst;
