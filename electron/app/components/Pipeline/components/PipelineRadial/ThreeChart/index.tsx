import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RadialData } from "../../../types";
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
  const requestID = useRef(0);
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const cube = useRef<THREE.Mesh | null>(null);
  const container = useRef<HTMLDivElement | null>(null);

  const sceneSetup = (): void => {
    if (container.current !== null) {
      scene.current = new THREE.Scene();
      camera.current = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.current.position.z = 5;
      renderer.current = new THREE.WebGLRenderer();
      renderer.current.setSize(800, 800);
      container.current.appendChild(renderer.current.domElement); // eslint-disable-line
    }
  };

  const addSceneObjects = (): void => {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true,
    });

    cube.current = new THREE.Mesh(geometry, material);

    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0); // eslint-disable-line
    lights[1] = new THREE.PointLight(0xffffff, 1, 0); // eslint-disable-line
    lights[2] = new THREE.PointLight(0xffffff, 1, 0); // eslint-disable-line

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    if (scene.current !== null) {
      scene.current.add(cube.current);
      scene.current.add(lights[0]);
      scene.current.add(lights[1]);
      scene.current.add(lights[2]);
    }
  };

  const tick = (): void => {
    if (cube.current !== null && renderer.current !== null && scene.current !== null && camera.current !== null) {
      cube.current.rotation.x += 0.01;
      cube.current.rotation.y += 0.01;
      renderer.current.render(scene.current, camera.current);
      requestID.current = window.requestAnimationFrame(tick);
    }
  };

  useEffect(() => {
    sceneSetup();
    addSceneObjects();
    tick();

    return () => {
      window.cancelAnimationFrame(requestID.current);
    };
  }, []);

  return <div className={styles.sunburst} ref={container} />;
};

export default ThreeRadial;
