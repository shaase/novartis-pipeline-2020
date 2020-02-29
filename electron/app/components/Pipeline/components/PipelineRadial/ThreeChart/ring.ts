import * as THREE from "three";

class SegmentRing extends THREE.Mesh {
  constructor(material: THREE.MeshBasicMaterial) {
    const innerRadius = 150;
    const outerRadius = 200;

    const geometry = new THREE.RingBufferGeometry(innerRadius, outerRadius, 64);
    super(geometry, material);
  }

  update(innerRadius: number, outerRadius: number): void {
    if (this.geometry instanceof THREE.BufferGeometry) {
      const geometry = new THREE.RingBufferGeometry(innerRadius, outerRadius, 64);
      const { position } = geometry.attributes;
      this.geometry.setAttribute("position", position);
    }
  }
}

export default SegmentRing;
