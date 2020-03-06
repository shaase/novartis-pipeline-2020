import { RadialNode } from "../../../types";

const getCentroid = (node: RadialNode, alignment: string, isRight: boolean): Origin => {
  const { y0 } = node;
  let { y1 } = node;
  const mod = isRight ? 0.01 : 0.005;

  if (alignment === "inside") {
    y1 = y0 + mod;
  }

  const xNode = { ...node, y1 };
  const centroid = getArc.centroid(xNode);

  const x = Number.isNaN(centroid[0]) ? 0 : centroid[0];
  const y = Number.isNaN(centroid[1]) ? 0 : centroid[1];
  return { x, y };
};

export default getCentroid;
