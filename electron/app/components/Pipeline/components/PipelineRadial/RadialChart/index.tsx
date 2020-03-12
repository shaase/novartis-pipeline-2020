import React, { MouseEvent, TouchEvent, useEffect, useRef } from "react";
import { scaleLinear, scaleSqrt } from "d3-scale";
import { interpolate as d3interpolate } from "d3-interpolate";
import { startGL, updateGL, updateGLInteractor, readGL } from "./glsl";
import { studiesForPath, studiesForPathAndPhases } from "../../../data";
import { RadialNode, RadialData, NodeArc } from "../../../types";
import { itemsForPath, eventPosition, rotatePoint, hexToRgbArray, lighten } from "../../../utils";
import { subscribe, update, unsubscribe, xScale, yScale } from "./radial-state";
import emptyRing from "../../../../../images/pipeline/radial-empty.svg";
import phaseRing from "../../../../../images/pipeline/phase-ring.svg";
// import RadialLabels from "../RadialLabels";
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
  const { segments, labels, xDomain, xRange, yDomain, yRange, studyCode, width } = data;
  const { root: pathRoot, level } = itemsForPath(path);
  const studies = studiesForPathAndPhases(path, phases, compound);
  const noData = studies.length === 0;

  const canvas = useRef<HTMLCanvasElement | null>(null);
  const interactor = useRef<HTMLCanvasElement | null>(null);
  const arcMap = useRef<Map<string, RadialNode>>(new Map());
  const selectedNode = useRef<RadialNode | undefined>(undefined);
  const segmentsRef = useRef<RadialNode[]>([]);

  const nodeArc = (node: RadialNode): NodeArc => {
    const { x0 = 0, x1 = 0, y0 = 0, y1 = 0, opacity = 1 } = node;
    const startAngle = Math.max(0, Math.min(2 * Math.PI, xScale(x0)));
    const endAngle = Math.max(0, Math.min(2 * Math.PI, xScale(x1)));
    let innerRadius = Math.max(0, yScale(y0)) - 2;
    const outerRadius = Math.max(0, yScale(y1));
    const diff = outerRadius - innerRadius;
    if (diff > 4 && diff < 20) innerRadius -= 10;

    const theta = [startAngle, endAngle];
    const radius = [innerRadius / width, outerRadius / width];
    const color = hexToRgbArray(node.fill || "#FFFFFF");
    const alpha = opacity;

    return { theta, radius, color, alpha };
  };

  const btnArc = (node: RadialNode): NodeArc => {
    const { theta, radius } = nodeArc(node);
    const { rgbArray } = node;
    const color = [rgbArray[0] / 255, rgbArray[1] / 255, 0];
    const alpha = 1;

    return { theta, radius, color, alpha };
  };

  const selectedArc = (node: RadialNode): NodeArc => {
    const { theta, radius, alpha } = nodeArc(node);
    const color = hexToRgbArray(lighten(node.fill || "#FFFFFF", 0.4));

    return { theta, radius, color, alpha };
  };

  const buildMap = (): void => {
    if (arcMap.current.size === 0) {
      segments.forEach((node: RadialNode) => {
        arcMap.current.set(node.rgbArray.join("-"), node);
      });
    }
  };

  const onInterpolation = (): void => {
    const arcs = segmentsRef.current.map((node: RadialNode) => nodeArc(node));

    if (selectedNode.current !== undefined) {
      arcs.unshift(selectedArc(selectedNode.current));
    }

    updateGL(arcs);

    const buttons = segments.map((node: RadialNode) => btnArc(node));
    updateGLInteractor(buttons);
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
      onInterpolation();
    }
  };

  const onUp = (): void => {
    if (selectedNode.current !== undefined) {
      const { name, parent, isStudyContainer } = selectedNode.current;
      let { route } = selectedNode.current;
      route =
        isStudyContainer && route.includes("Content/Tumors")
          ? route
              .split("/")
              .slice(0, -1)
              .join("/")
          : route;

      let inferredCompound;
      if (pathRoot === "Compounds") {
        if (level === 3) {
          inferredCompound = name;
        } else if (level === 4) {
          inferredCompound = parent.name;
        } else if (level === 5) {
          inferredCompound = parent.parent.name;
        }
      } else if (isStudyContainer) {
        inferredCompound = name;
      } else if (level === 7) {
        inferredCompound = parent.name;
      }

      if (studyCode !== undefined) {
        onNavigate(route, inferredCompound);
      } else {
        const compoundStudies = studiesForPath(route, undefined, inferredCompound);

        if (compoundStudies.length > 1) {
          onNavigate(route, inferredCompound);
        } else if (compoundStudies.length === 1) {
          const study = compoundStudies[0];
          onNavigate(study.path, inferredCompound);
        }
      }

      selectedNode.current = undefined;
    }
  };

  if (data.segments.length > 0) {
    segmentsRef.current = data.segments;
    update(path, xDomain, xRange, yDomain, yRange);
    buildMap();
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

      {!noData && isVisible && (
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

      {/* {!noData && (
        <RadialLabels
          path={path}
          canvasSize={width}
          nodes={data.segments}
          xDomain={xDomain}
          xRange={xRange}
          yDomain={yDomain}
          yRange={yRange}
          xScale={xScale.current}
          yScale={yScale.current}
        />
      )} */}
    </div>
  );
};

export default RadialChart;
