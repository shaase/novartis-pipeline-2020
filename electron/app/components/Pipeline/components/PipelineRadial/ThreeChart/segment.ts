import * as THREE from "three";
import { RadialNode, NodeArc } from "../../../types";
import fixedNode from "./fixed-node";
import ThreeRadial from ".";

const hexColor = (hexString: string): number => {
  const str = `${hexString}`.replace(/[^\da-f]/gi, "");
  return parseInt(str, 16);
};

class Segment extends THREE.Mesh {
  node: RadialNode;

  getArc: (node: RadialNode) => NodeArc;

  constructor(n: RadialNode, ga: (n: RadialNode) => NodeArc) {
    const startAngle = 0;
    const endAngle = 1.5708;
    const innerRadius = 153.64254;
    const outerRadius = 288.095;
    const x1 = Math.cos(endAngle) * innerRadius;
    const y1 = Math.sin(endAngle) * innerRadius;

    const segment = new THREE.Shape();
    segment.absarc(0, 0, outerRadius, startAngle, endAngle, false);
    segment.lineTo(x1, y1);
    segment.absarc(0, 0, innerRadius, endAngle, startAngle, true);

    const geometry = new THREE.ShapeBufferGeometry(segment, 64);
    const material = new THREE.MeshBasicMaterial({ color: hexColor(n.color) });
    // material.transparent = true;
    // material.opacity = 0.4;
    super(geometry, material);
    this.node = n;
    this.getArc = ga;
  }

  update(path: string): void {
    if (this.geometry instanceof THREE.BufferGeometry) {
      const fn = fixedNode(this.node, path);
      const { startAngle, endAngle, innerRadius, outerRadius } = this.getArc(fn);
      const x1 = Math.cos(endAngle) * innerRadius;
      const y1 = Math.sin(endAngle) * innerRadius;

      const max = Math.max(startAngle, endAngle);
      const min = Math.min(startAngle, endAngle);
      const diff = Math.round((max - min) * 100) / 100;
      const isCircle = diff === 6.28;

      if (isCircle) {
        const geometry = new THREE.RingBufferGeometry(innerRadius, outerRadius, 128);
        const { position } = geometry.attributes;
        this.geometry.setAttribute("position", position);
      } else {
        const segment = new THREE.Shape();
        segment.absarc(0, 0, outerRadius, startAngle, endAngle, false);
        segment.lineTo(x1, y1);
        segment.absarc(0, 0, innerRadius, endAngle, startAngle, true);

        const geometry = new THREE.ShapeBufferGeometry(segment, 64);
        const { position } = geometry.attributes;
        this.geometry.setAttribute("position", position);
      }
    }
  }
}

export default Segment;
