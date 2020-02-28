import { Mesh, MeshBasicMaterial, ShapeBufferGeometry } from "three";
import { RadialNode, NodeArc } from "../../../types";
import Shape from "./shape";
import fixedNode from "./fixed-node";

interface ControlPoints {
  cx0: number;
  cy0: number;
  cx1: number;
  cy1: number;
}

const hexColor = (hexString: string): number => {
  const str = `${hexString}`.replace(/[^\da-f]/gi, "");
  return parseInt(str, 16);
};

const approxFactor = (startAngle: number, endAngle: number): number => {
  let arc = endAngle - startAngle;

  // Always choose the smaller arc
  if (Math.abs(arc) > Math.PI) {
    arc -= Math.PI * 2;
    arc %= Math.PI * 2;
  }
  return (4 / 3) * Math.tan(arc / 4);
};

const controlPoints = (startAngle: number, endAngle: number, radius: number): ControlPoints => {
  const factor = approxFactor(startAngle, endAngle);

  const dist = Math.sqrt(radius * radius * (1 + factor * factor));
  const angle1 = startAngle + Math.atan(factor);
  const angle2 = endAngle - Math.atan(factor);
  const points: ControlPoints = {
    cx0: Math.cos(angle1) * dist,
    cy0: Math.sin(angle1) * dist,
    cx1: Math.cos(angle2) * dist,
    cy1: Math.sin(angle2) * dist,
  };

  return points;
};

class Segment extends Mesh {
  node: RadialNode;

  getArc: (node: RadialNode) => NodeArc;

  constructor(n: RadialNode, ga: (n: RadialNode) => NodeArc) {
    const segment = new Shape();
    segment.move(0, 0);
    segment.line(50, 0);
    segment.line(50, 50);
    segment.line(0, 50);
    segment.line(0, 0);

    const geometry = new ShapeBufferGeometry(segment, 64);
    const material = new MeshBasicMaterial({ color: hexColor(n.color) });
    // material.transparent = true;
    // material.opacity = 0.4;
    super(geometry, material);
    this.node = n;
    this.getArc = ga;
  }

  update(path: string): void {
    if (this.geometry instanceof ShapeBufferGeometry) {
      const fn = fixedNode(this.node, path);
      const { startAngle, endAngle, innerRadius, outerRadius } = this.getArc(fn);
      console.log(startAngle, endAngle, innerRadius, outerRadius);
      const segment = new Shape();
      // segment.move(0, 0);
      // segment.line(500, 0);
      // segment.line(500, 500);
      // segment.line(0, 500);
      // segment.line(0, 0);

      const x1 = Math.cos(startAngle) * innerRadius;
      const y1 = Math.sin(startAngle) * innerRadius;
      const x2 = Math.cos(endAngle) * innerRadius;
      const y2 = Math.sin(endAngle) * innerRadius;
      const x3 = Math.cos(endAngle) * outerRadius;
      const y3 = Math.sin(endAngle) * outerRadius;
      const x4 = Math.cos(startAngle) * outerRadius;
      const y4 = Math.sin(startAngle) * outerRadius;
      const cp0 = controlPoints(startAngle, endAngle, innerRadius);
      const cp1 = controlPoints(startAngle, endAngle, outerRadius);
      console.log(x4, y4, cp1);

      segment.moveTo(x1, y1);
      segment.lineTo(x2, y2);
      segment.lineTo(x3, y3);
      // segment.lineTo(x4, y4);
      segment.bezierCurveTo(cp1.cx1, cp1.cy1, cp1.cx0, cp0.cy1, x4, y4);

      const geometry = new ShapeBufferGeometry(segment, 64);
      const { position } = geometry.attributes;
      this.geometry.setAttribute("position", position);
    }
  }
}

export default Segment;
