import * as THREE from "three";

interface Coord {
  x: number;
  y: number;
}

class Shape extends THREE.Shape {
  static coord(x0: number, y0: number): Coord {
    const containerSize = 785;
    return { x: -containerSize / 2 + x0, y: containerSize / 2 - y0 };
  }

  move(x0: number, y0: number): void {
    const { x, y } = Shape.coord(x0, y0);
    this.moveTo(x, y);
  }

  line(x0: number, y0: number): void {
    const { x, y } = Shape.coord(x0, y0);
    this.lineTo(x, y);
  }

  curve(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number): void {
    const { x, y } = Shape.coord(x0, y0);
    const { x: xa, y: ya } = Shape.coord(x1, y1);
    const { x: xb, y: yb } = Shape.coord(x2, y2);
    this.bezierCurveTo(x, y, xa, ya, xb, yb);
  }
}

export default Shape;
