import React from "react";

interface Interaction {
  clientX?: number;
  clientY?: number;
  touches?: React.TouchList;
}

interface Position {
  x: number;
  y: number;
}

export const eventPosition = (e: Interaction): Position => {
  const x = e.clientY !== undefined ? e.clientX : e.touches !== undefined ? e.touches[0].clientX : 0;
  const y = e.clientY !== undefined ? e.clientY : e.touches !== undefined ? e.touches[0].clientY : 0;
  return { x: x || 0, y };
};

export const rotatePoint = (cx: number, cy: number, x0: number, y0: number, radians: number): Position => {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const x = cos * (x0 - cx) + sin * (y0 - cy) + cx;
  const y = cos * (y0 - cy) - sin * (x0 - cx) + cy;
  return { x, y };
};
