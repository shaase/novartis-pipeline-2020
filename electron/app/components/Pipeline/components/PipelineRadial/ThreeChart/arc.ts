import * as THREE from "three";

class SegmentArc extends THREE.Mesh {
  constructor(material: THREE.MeshBasicMaterial) {
    const startAngle = 0;
    const endAngle = 1;
    const innerRadius = 150;
    const outerRadius = 200;
    const x1 = Math.cos(endAngle) * innerRadius;
    const y1 = Math.sin(endAngle) * innerRadius;

    const segment = new THREE.Shape();
    segment.absarc(0, 0, outerRadius, startAngle, endAngle, false);
    segment.lineTo(x1, y1);
    segment.absarc(0, 0, innerRadius, endAngle, startAngle, true);

    const geometry = new THREE.ShapeBufferGeometry(segment, 64);
    super(geometry, material);
  }

  update(startAngle: number, endAngle: number, innerRadius: number, outerRadius: number): void {
    if (this.geometry instanceof THREE.BufferGeometry) {
      const x1 = Math.cos(endAngle) * innerRadius;
      const y1 = Math.sin(endAngle) * innerRadius;

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

export default SegmentArc;
