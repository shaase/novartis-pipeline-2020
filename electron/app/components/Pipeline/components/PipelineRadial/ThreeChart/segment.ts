import * as THREE from "three";
import { RadialNode, NodeArc } from "../../../types";
import fixedNode from "./fixed-node";
import { hexColor } from "./utils";
import SegmentArc from "./arc";
import SegmentRing from "./ring";

class Segment extends THREE.Group {
  node: RadialNode;

  arc: SegmentArc;

  ring: SegmentRing;

  getArc: (node: RadialNode) => NodeArc;

  constructor(n: RadialNode, ga: (n: RadialNode) => NodeArc) {
    const material = new THREE.MeshBasicMaterial({ color: hexColor(n.color) });
    // material.transparent = true;
    // material.opacity = 0.4;
    super();
    this.node = n;
    this.arc = new SegmentArc(material);
    this.ring = new SegmentRing(material);
    this.getArc = ga;
  }

  update(path: string): void {
    const fn = fixedNode(this.node, path);
    const { startAngle, endAngle, innerRadius, outerRadius } = this.getArc(fn);
    const width = outerRadius - innerRadius;
    const max = Math.max(startAngle, endAngle);
    const min = Math.min(startAngle, endAngle);
    const diff = Math.round((max - min) * 100) / 100;
    const isCircle = diff > 6.2;
    // console.log(this.node.name, startAngle, endAngle, innerRadius, outerRadius);

    if (diff === 0 || width === 0) {
      this.remove(this.arc);
      this.remove(this.ring);
    } else if (isCircle) {
      this.remove(this.arc);
      this.add(this.ring);
      this.ring.update(innerRadius, outerRadius);
    } else {
      this.add(this.arc);
      this.remove(this.ring);
      this.arc.update(startAngle, endAngle, innerRadius, outerRadius);
    }
  }
}

export default Segment;
