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
