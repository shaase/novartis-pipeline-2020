import React, { useEffect, useRef } from "react";
import { arc, Arc } from "d3-shape";
import { scaleLinear, scaleSqrt } from "d3-scale";
import { interpolate as d3interpolate } from "d3-interpolate";
import * as THREE from "three";
import { studiesForPath, studiesForPathAndPhases } from "../../../data";
import { RadialNode, RadialData, RadialArc } from "../../../types";
import { itemsForPath } from "../../../utils";
import getSunburstSegment from "./segment";
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

  const requestID = useRef(0);
  const xScale = useRef(scaleLinear());
  const yScale = useRef(scaleSqrt());
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const container = useRef<HTMLDivElement | null>(null);

  const sceneSetup = (): void => {
    if (container.current !== null) {
      scene.current = new THREE.Scene();
      scene.current.background = new THREE.Color(0x444444);
      camera.current = new THREE.PerspectiveCamera(70, 1, 0.01, 10000);
      camera.current.position.x = 1;
      camera.current.position.y = 0.5;
      camera.current.position.z = 3.2;
      renderer.current = new THREE.WebGLRenderer({ antialias: true });
      renderer.current.setSize(785, 785);
      container.current.appendChild(renderer.current.domElement); // eslint-disable-line
    }
  };

  // eslint-disable-next-line
  const getArc: Arc<any, RadialArc> = arc<any, RadialArc>()
    .startAngle((d: RadialArc) => Math.max(0, Math.min(2 * Math.PI, xScale.current(d.x0))))
    .endAngle((d: RadialArc) => Math.max(0, Math.min(2 * Math.PI, xScale.current(d.x1))))
    .innerRadius((d: RadialArc) => Math.max(0, yScale.current(d.y0)))
    .outerRadius((d: RadialArc) => Math.max(0, yScale.current(d.y1)));

  const addSceneObjects = (): void => {
    if (segments.length > 0) {
      const node = segments[238];
      const segment = getSunburstSegment(node, path, studyCode, getArc);
      console.log(node);
      if (scene.current !== null) {
        scene.current.add(segment);
      }
    }
  };

  const tick = (): void => {
    if (renderer.current !== null && scene.current !== null && camera.current !== null) {
      renderer.current.render(scene.current, camera.current);
      requestID.current = window.requestAnimationFrame(tick);
    }
  };

  if (data.segments.length > 0) {
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

    addSceneObjects();
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
