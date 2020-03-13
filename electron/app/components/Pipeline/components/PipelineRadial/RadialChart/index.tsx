import React, { MouseEvent, TouchEvent, useEffect, useRef } from "react";
import { ScaleLinear, ScalePower, scaleLinear, scaleSqrt } from "d3-scale";
import { interpolate as d3interpolate } from "d3-interpolate";
import { startGL, updateGL, updateGLInteractor, readGL } from "./glsl";
import { studiesForPath, studiesForPathAndPhases } from "../../../data";
import { RadialNode, RadialData, NodeArc, LabelArc } from "../../../types";
import { itemsForPath, eventPosition, rotatePoint } from "../../../utils";
import formatRoute from "./format-route";
import updateLabels from "./update-labels";
import { nodeArc, btnArc, labelArc, selectedArc } from "./radial-arcs";
import { subscribe, unsubscribe, interpolate } from "./radial-state";
import emptyRing from "../../../../../images/pipeline/radial-empty.svg";
import phaseRing from "../../../../../images/pipeline/phase-ring.svg";
import styles from "./index.module.scss";

const empty: number[] = [];

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

  const prevPath = useRef("");
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const labels = useRef<HTMLCanvasElement | null>(null);
  const interactor = useRef<HTMLCanvasElement | null>(null);
  const arcMap = useRef<Map<string, RadialNode>>(new Map());
  const selectedNode = useRef<RadialNode | undefined>(undefined);
  const segmentsRef = useRef<RadialNode[]>([]);
  const xScale = useRef<ScaleLinear<number, number>>(scaleLinear());
  const yScale = useRef<ScalePower<number, number>>(scaleSqrt());
  const xd = useRef(d3interpolate(xScale.current.domain(), empty));
  const yd = useRef(d3interpolate(xScale.current.domain(), empty));
  const yr = useRef(d3interpolate(xScale.current.domain(), empty));

  const buildMap = (): void => {
    if (arcMap.current.size === 0) {
      segments.forEach((node: RadialNode) => {
        arcMap.current.set(node.rgbArray.join("-"), node);
      });
    }
  };

  const onInterpolation = (i: number): void => {
    xScale.current.domain(xd.current(i));
    yScale.current.domain(yd.current(i)).range(yr.current(i));
    const arcs = segmentsRef.current.map((node: RadialNode) => nodeArc(node, width, xScale.current, yScale.current));
    const buttons = segmentsRef.current.map((node: RadialNode) => btnArc(node, width, xScale.current, yScale.current));
    const labelArcs = segmentsRef.current.map((node: RadialNode) =>
      labelArc(node, path, xScale.current, yScale.current),
    );

    if (selectedNode.current !== undefined) {
      const selected = selectedArc(selectedNode.current, width, xScale.current, yScale.current);
      arcs.unshift(selected);
    }

    updateGL(arcs);
    updateGLInteractor(buttons);

    if (labels.current !== null) {
      const context = labels.current.getContext("2d");
      if (context !== null) {
        updateLabels(context, labelArcs);
      }
    }
  };

  const onDown = (e: MouseEvent | TouchEvent): void => {
    if (canvas.current !== null) {
      const { x: left, y: top, width: size } = canvas.current.getBoundingClientRect();
      const { x, y } = eventPosition(e);
      const { x: rotX, y: rotY } = rotatePoint(left + size / 2, top + size / 2, x, y, Math.PI / -2);
      const px = (rotX - left) / size;
      const py = (rotY - top) / size;
      const glx = px * 1574;
      const gly = py * 1564;
      const pixel = readGL(glx, gly);

      const key = `${pixel[0]}-${pixel[1]}-${pixel[2]}`;
      const node = arcMap.current.get(key);
      selectedNode.current = node;
      onInterpolation(1);
    }
  };

  const onUp = (): void => {
    if (selectedNode.current !== undefined) {
      const { route, derivedCompound } = formatRoute(selectedNode.current, pathRoot, level);

      if (studyCode !== undefined) {
        onNavigate(route, derivedCompound);
      } else {
        const compoundStudies = studiesForPath(route, undefined, derivedCompound);

        if (compoundStudies.length > 1) {
          onNavigate(route, derivedCompound);
        } else if (compoundStudies.length === 1) {
          const study = compoundStudies[0];
          onNavigate(study.path, derivedCompound);
        }
      }

      selectedNode.current = undefined;
    }
  };

  if (data.segments.length > 0) {
    segmentsRef.current = data.segments;
    if (xScale.current.domain().length === 0) {
      xScale.current.domain(xDomain).range(xRange);
      yScale.current.domain(yDomain).range(yRange);
    } else if (prevPath.current !== path) {
      xd.current = d3interpolate(xScale.current.domain(), xDomain);
      yd.current = d3interpolate(yScale.current.domain(), yDomain);
      yr.current = d3interpolate(yScale.current.range(), yRange);
      xScale.current.domain(xd.current(0)).range(xRange);
      yScale.current.domain(yd.current(0)).range(yr.current(0));
      prevPath.current = path;
    }

    buildMap();
    interpolate();
  }

  useEffect(() => {
    if (canvas.current !== null) {
      startGL(canvas.current, interactor.current, width);
    }

    subscribe(onInterpolation);

    return () => {
      unsubscribe(onInterpolation);
    };
  }, []);

  const size = width * window.devicePixelRatio;

  return (
    <div className={isVisible ? styles.sunburst : styles.sunburstHidden}>
      {isVisible && (
        <div className={styles.phaseContainer}>
          <img src={phaseRing} className={styles.phaseRing} alt="phase-ring" />
        </div>
      )}

      {noData ? (
        <img src={emptyRing} className={styles.empty} />
      ) : (
        <canvas className={styles.canvas} width={size} height={size} ref={canvas} />
      )}

      {!noData && (
        <canvas
          className={styles.interactor}
          width={size}
          height={size}
          ref={interactor}
          onTouchStart={onDown}
          onTouchEnd={onUp}
          onMouseDown={onDown}
          onMouseUp={onUp}
          onMouseOut={onUp}
        />
      )}

      {!noData && <canvas className={styles.labels} width={size} height={size} ref={labels} />}
    </div>
  );
};

export default RadialChart;
