import { RadialNode } from "../../../types";
import { itemsForPath, slicePath } from "../../../utils";

const textDisplay = (
  node: RadialNode,
  path: string,
  getArcLength: (n: RadialNode) => number,
  getArcWidth: (n: RadialNode) => number,
): string => {
  const { route, name, parent, depth = 0, isStudyContainer } = node;
  const { root, level } = itemsForPath(path);
  const trunc = root === "Tumors" ? slicePath(path, 6) : path;

  const nodeName = name || "";
  const arcLength = getArcLength(node);

  if (route === undefined || !(route.includes(trunc) || trunc.includes(route))) {
    return "none";
  }

  if (nodeName === "" || nodeName === "*") {
    return "none";
  }

  if (parent.isStudyContainer && ((root === "Tumors" && depth > 7) || (root === "Compounds" && depth > 6))) {
    return "none";
  }

  if (arcLength < 25) {
    return "none";
  }

  if (root === "Compounds" && level < 2 && depth > 2) {
    return "none";
  }

  let arcWidth = getArcWidth(node);

  if (arcWidth < 50 && arcLength < 30 && nodeName.length > 8) {
    return "none";
  }

  if (nodeName === "Severe Aplastic Anemia") {
    return "none";
  }

  if (arcWidth < 50 && arcWidth > 1) {
    const curveType = depth < 6 ? "curved-capped" : "curved";
    if (node.parent.isEmpty) {
      arcWidth = getArcWidth(parent);
      if (arcWidth < 40 && arcWidth > 1) {
        return arcLength > 30 ? curveType : "none";
      }
    }

    return arcLength > 30 ? curveType : "none";
  }

  if (arcWidth > 60 && arcLength > 170) {
    return "curved";
  }

  if (isStudyContainer || root === "Compounds") {
    if (arcWidth > 20) {
      return arcLength + 10 > arcWidth && arcLength > 70 ? "curved" : "inline";
    }
    return "none";
  }

  if (!parent.isEmpty && arcWidth < 1) {
    return "none";
  }

  return "inline";
};

export default textDisplay;
