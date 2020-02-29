import * as THREE from "three";

const arcGeometry = (
  startAngle: number,
  endAngle: number,
  innerRadius: number,
  outerRadius: number,
): THREE.BufferGeometry => {
  const x1 = Math.cos(endAngle) * innerRadius;
  const y1 = Math.sin(endAngle) * innerRadius;

  const segment = new THREE.Shape();
  segment.absarc(0, 0, outerRadius, startAngle, endAngle, false);
  segment.lineTo(x1, y1);
  segment.absarc(0, 0, innerRadius, endAngle, startAngle, true);

  const geometry = new THREE.ShapeBufferGeometry(segment, 16);
  return geometry;
};

class SegmentArc extends THREE.Mesh {
  constructor(material: THREE.MeshBasicMaterial) {
    const startAngle = 0.522;
    const endAngle = 6.078;
    const innerRadius = 129;
    const outerRadius = 162;

    const geometry = arcGeometry(startAngle, endAngle, innerRadius, outerRadius);
    super(geometry, material);
  }

  update(startAngle: number, endAngle: number, innerRadius: number, outerRadius: number): void {
    if (this.geometry instanceof THREE.BufferGeometry) {
      const geometry = arcGeometry(startAngle, endAngle, innerRadius, outerRadius);
      const { position } = geometry.attributes;
      this.geometry.setAttribute("position", position);
    }
  }
}

export default SegmentArc;
