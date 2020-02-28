import React, { useEffect, useRef } from "react";
import { arc, Arc } from "d3-shape";
import { scaleLinear, scaleSqrt } from "d3-scale";
import { interpolate as d3interpolate } from "d3-interpolate";
import * as THREE from "three";
import { studiesForPath, studiesForPathAndPhases } from "../../../data";
import { RadialNode, RadialData, RadialArc, NodeArc } from "../../../types";
import { itemsForPath } from "../../../utils";
import getSunburstSegment from "./segment";
import Segment from "./buffer";
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

const ThreeRadial: React.FC<Props> = ({ isVisible, path, compound, phases, data, onNavigate }: Props) => {
  const { segments, xDomain, xRange, yDomain, yRange, studyCode, width } = data;
  const { root: pathRoot, level } = itemsForPath(path);
  const studies = studiesForPathAndPhases(path, phases, compound);
  const noData = studies.length === 0;

  const hasAddedObjects = useRef(false);
  const requestID = useRef(0);
  const xScale = useRef(scaleLinear());
  const yScale = useRef(scaleSqrt());
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.OrthographicCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const testBuffer = useRef<Segment | null>(null);

  const sceneSetup = (): void => {
    if (container.current !== null) {
      const w = 785;
      scene.current = new THREE.Scene();
      scene.current.background = new THREE.Color(0x444444);
      camera.current = new THREE.OrthographicCamera(w / -2, w / 2, w / 2, w / -2, -100, 100);
      renderer.current = new THREE.WebGLRenderer({ antialias: true });
      renderer.current.setSize(w, w);
      container.current.appendChild(renderer.current.domElement); // eslint-disable-line
    }
  };

  // eslint-disable-next-line
  const getArc: Arc<any, RadialArc> = arc<any, RadialArc>()
    .startAngle((d: RadialArc) => Math.max(0, Math.min(2 * Math.PI, xScale.current(d.x0))))
    .endAngle((d: RadialArc) => Math.max(0, Math.min(2 * Math.PI, xScale.current(d.x1))))
    .innerRadius((d: RadialArc) => Math.max(0, yScale.current(d.y0)))
    .outerRadius((d: RadialArc) => Math.max(0, yScale.current(d.y1)));

  const getNodeArc = (node: RadialNode): NodeArc => {
    const { x0 = 0, x1 = 0, y0 = 0, y1 = 0 } = node;
    const startAngle = Math.max(0, Math.min(2 * Math.PI, xScale.current(x0)));
    const endAngle = Math.max(0, Math.min(2 * Math.PI, xScale.current(x1)));
    const innerRadius = Math.max(0, yScale.current(y0));
    const outerRadius = Math.max(0, yScale.current(y1));
    return { startAngle, endAngle, innerRadius, outerRadius };
  };

  const addSceneObjects = (): void => {
    if (scene.current !== null) {
      const node = segments[238];
      testBuffer.current = new Segment(node, getNodeArc);
      const segment = getSunburstSegment(node, path, studyCode, getArc);

      scene.current.add(testBuffer.current);
      scene.current.add(segment);
    }
  };

  const updateObjects = (): void => {
    if (testBuffer.current !== null) {
      testBuffer.current.update(path);
    }
  };

  const tick = (): void => {
    if (renderer.current !== null && scene.current !== null && camera.current !== null) {
      renderer.current.render(scene.current, camera.current);
      requestID.current = window.requestAnimationFrame(tick);
    }
  };

  if (data.segments.length > 0) {
    if (!hasAddedObjects.current) {
      addSceneObjects();
      hasAddedObjects.current = true;
    }

    if (xScale.current.domain().length === 0) {
      xScale.current.domain(xDomain).range(xRange);
      yScale.current.domain(yDomain).range(yRange);
    } else {
      const xd = d3interpolate(xScale.current.domain(), xDomain);
      const yd = d3interpolate(yScale.current.domain(), yDomain);
      const yr = d3interpolate(yScale.current.range(), yRange);
      xScale.current.domain(xd(1)).range(xRange);
      yScale.current.domain(yd(1)).range(yr(1));
    }

    updateObjects();
  }

  useEffect(() => {
    sceneSetup();
    tick();

    return () => {
      window.cancelAnimationFrame(requestID.current);
    };
  }, []);

  return <div className={styles.sunburst} ref={container} />;
};

export default ThreeRadial;
