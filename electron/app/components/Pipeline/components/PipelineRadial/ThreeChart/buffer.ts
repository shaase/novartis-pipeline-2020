import * as THREE from "three";
import { RadialNode } from "../../../types";
import Shape from "./shape";

class Segment extends THREE.Mesh {
  node: RadialNode;

  constructor(n: RadialNode) {
    const segment = new Shape();
    segment.move(0, 0);
    segment.line(50, 0);
    segment.line(50, 50);
    segment.line(0, 50);
    segment.line(0, 0);

    const geometry = new THREE.ShapeBufferGeometry(segment, 64);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // material.transparent = true;
    // material.opacity = 0.4;
    super(geometry, material);
    this.node = n;
  }

  update(): void {
    // console.log(this.node);

    if (this.geometry instanceof THREE.BufferGeometry) {
      const segment = new Shape();
      segment.move(0, 0);
      segment.line(500, 0);
      segment.line(500, 500);
      segment.line(0, 500);
      segment.line(0, 0);

      const geometry = new THREE.ShapeBufferGeometry(segment, 64);
      const { position } = geometry.attributes;
      this.geometry.setAttribute("position", position);
    }
  }
}

export default Segment;
