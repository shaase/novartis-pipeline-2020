import React, { useEffect, useRef } from "react";
import { arc, DefaultArcObject, Arc } from "d3-shape";
import { scaleLinear, scaleSqrt } from "d3-scale";
import { interpolate as d3interpolate } from "d3-interpolate";
import svgMesh3d from "svg-mesh-3d";
import CreateGeom from "three-simplicial-complex";
import * as THREE from "three";
import { studiesForPath, studiesForPathAndPhases } from "../../../data";
import { RadialNode, RadialData } from "../../../types";
import { itemsForPath } from "../../../utils";
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

const hexdec = (hexString: string): number => {
  const str = `${hexString}`.replace(/[^\da-f]/gi, "");
  return parseInt(str, 16);
};

const ThreeRadial: React.FC<Props> = ({ isVisible, path, compound, phases, data, onNavigate }: Props) => {
  const { segments, xDomain, xRange, yDomain, yRange, studyCode, width } = data;
  const { root: pathRoot, level } = itemsForPath(path);
  const studies = studiesForPathAndPhases(path, phases, compound);
  const noData = studies.length === 0;
  const xScale = scaleLinear();
  const yScale = scaleSqrt();

  xScale.domain(xDomain).range(xRange);
  yScale.domain(yDomain).range(yRange);

  const requestID = useRef(0);
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const SvgGeom = CreateGeom(THREE);

  const getSegment = (node: RadialNode): THREE.Mesh => {
    const svgPath =
      "M-145.44990454622913,248.68263769811685A288.095,288.095,0,0,1,-285.6829528230724,-37.20187483568798L-152.356185163371,-19.83995080868849A153.64254230396793,153.64254230396793,0,0,0,-77.56918069509052,132.62372718303075Z";
    const meshData = svgMesh3d(svgPath);
    const geo = new SvgGeom(meshData);
    const mat = new THREE.MeshBasicMaterial({ color: hexdec(node.color), side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, mat);
    return mesh;
  };

  const sceneSetup = (): void => {
    if (container.current !== null) {
      scene.current = new THREE.Scene();
      scene.current.background = new THREE.Color(0x444444);
      camera.current = new THREE.PerspectiveCamera(70, 1, 0.01, 10000);
      camera.current.position.z = 10;
      renderer.current = new THREE.WebGLRenderer({ antialias: true });
      renderer.current.setSize(785, 785);
      container.current.appendChild(renderer.current.domElement); // eslint-disable-line
    }
  };

  const addSceneObjects = (): void => {
    if (segments.length > 0) {
      const node = segments[238];
      const segment = getSegment(node);

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

  useEffect(() => {
    sceneSetup();
    tick();

    return () => {
      window.cancelAnimationFrame(requestID.current);
    };
  }, []);

  useEffect(() => {
    addSceneObjects();
  }, [data]);

  return <div className={styles.sunburst} ref={container} />;
};

export default ThreeRadial;
