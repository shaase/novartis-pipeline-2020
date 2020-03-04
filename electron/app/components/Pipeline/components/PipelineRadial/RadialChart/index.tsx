import React, { useEffect, useRef } from "react";
import { scaleLinear, scaleSqrt } from "d3-scale";
import { interpolate as d3interpolate } from "d3-interpolate";
import { startGL, updateGL } from "./glsl";
import { studiesForPath, studiesForPathAndPhases } from "../../../data";
import { RadialNode, RadialData, NodeArc } from "../../../types";
import { itemsForPath } from "../../../utils";
import { hexToRgb } from "./utils";
import emptyRing from "../../../../../images/pipeline/radial-empty.svg";
import phaseRing from "../../../../../images/pipeline/phase-ring.svg";
import styles from "./index.module.scss";

type Card = { file: string; label: string };

type Props = {
  isVisible: boolean;
  path: string;
  compound?: string;
  phases: number[];
  data: RadialData;
  onNavigate: (definedPath: string, definedCompound?: string, idling?: boolean) => void;
};

const RadialChart: React.FC<Props> = ({ isVisible, path, compound, phases, data, onNavigate }: Props) => {
  const { segments, xDomain, xRange, yDomain, yRange, studyCode, width } = data;
  const { root: pathRoot, level } = itemsForPath(path);
  const studies = studiesForPathAndPhases(path, phases, compound);
  const noData = studies.length === 0;

  const iterator = useRef(1);
  const startTime = useRef(Date.now());
  const raf = useRef(0);
  const xScale = useRef(scaleLinear());
  const yScale = useRef(scaleSqrt());
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const xd = useRef(d3interpolate(xScale.current.domain(), xDomain));
  const yd = useRef(d3interpolate(yScale.current.domain(), yDomain));
  const yr = useRef(d3interpolate(yScale.current.range(), yRange));

  const getArc = (node: RadialNode): NodeArc => {
    const { x0 = 0, x1 = 0, y0 = 0, y1 = 0 } = node;
    const startAngle = Math.max(0, Math.min(2 * Math.PI, xScale.current(x0)));
    const endAngle = Math.max(0, Math.min(2 * Math.PI, xScale.current(x1)));
    const innerRadius = Math.max(0, yScale.current(y0));
    const outerRadius = Math.max(0, yScale.current(y1));

    const theta = [startAngle, endAngle];
    const radius = [innerRadius / 789, outerRadius / 789];
    const color = hexToRgb(node.fill || "#FFFFFF");

    return { theta, radius, color };
  };

  const tick = (): void => {
    if (iterator.current < 1) {
      const now = Date.now();
      const diff = (now - startTime.current) / 600;
      iterator.current = Math.min(1, diff);
      xScale.current.domain(xd.current(iterator.current));
      yScale.current.domain(yd.current(iterator.current)).range(yr.current(iterator.current));
      const sliced = segments.slice(0, 300);
      const arcs = segments.map((node: RadialNode) => getArc(node));
      updateGL(arcs);
      raf.current = window.requestAnimationFrame(tick);
    }
  };

  if (data.segments.length > 0) {
    if (xScale.current.domain().length === 0) {
      xScale.current.domain(xDomain).range(xRange);
      yScale.current.domain(yDomain).range(yRange);
    } else {
      xd.current = d3interpolate(xScale.current.domain(), xDomain);
      yd.current = d3interpolate(yScale.current.domain(), yDomain);
      yr.current = d3interpolate(yScale.current.range(), yRange);
      startTime.current = Date.now();
      iterator.current = 0;
      xScale.current.domain(xd.current(iterator.current)).range(xRange);
      yScale.current.domain(yd.current(iterator.current)).range(yr.current(iterator.current));
    }

    tick();
  }

  useEffect(() => {
    if (canvas.current !== null) {
      startGL(canvas.current);
    }

    return () => {
      window.cancelAnimationFrame(raf.current);
    };
  }, []);

  const size = 789 * window.devicePixelRatio;

  return (
    <div className={styles.sunburst}>
      <div className={styles.phaseContainer}>
        <img src={phaseRing} className={styles.phaseRing} alt="phase-ring" />
      </div>

      {noData ? (
        <img src={emptyRing} className={styles.empty} />
      ) : (
        <canvas className={styles.canvas} width={size} height={size} ref={canvas} />
      )}
    </div>
  );
};

export default RadialChart;
