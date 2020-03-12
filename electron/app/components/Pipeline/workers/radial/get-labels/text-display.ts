import { RadialNode } from "../../../types";
import { itemsForPath, slicePath } from "../../../utils";

export const textDisplay = (node: RadialNode, path: string, length: number, width: number): string => {
  const { route, name, parent, depth = 0, isStudyContainer } = node;
  const { root, level } = itemsForPath(path);
  const trunc = root === "Tumors" ? slicePath(path, 6) : path;

  const nodeName = name || "";

  if (route === undefined || !(route.includes(trunc) || trunc.includes(route))) {
    return "none";
  }

  if (nodeName === "" || nodeName === "*") {
    return "none";
  }

  if (parent.isStudyContainer && ((root === "Tumors" && depth > 7) || (root === "Compounds" && depth > 6))) {
    return "none";
  }

  if (length < 25) {
    return "none";
  }

  if (root === "Compounds" && level < 2 && depth > 2) {
    return "none";
  }

  if (width < 50 && length < 30 && nodeName.length > 8) {
    return "none";
  }

  if (nodeName === "Severe Aplastic Anemia") {
    return "none";
  }

  if (width < 50 && length > 1) {
    const curveType = depth < 6 ? "curved-capped" : "curved";
    // TODO: handle this with parent arc
    if (node.parent.isEmpty) {
      // arcWidth = getArcWidth(parent);
      if (width < 40 && width > 1) {
        return length > 30 ? curveType : "none";
      }
    }

    return length > 30 ? curveType : "none";
  }

  if (width > 60 && length > 170) {
    return "curved";
  }

  if (isStudyContainer || root === "Compounds") {
    if (width > 20) {
      return length + 10 > width && length > 70 ? "curved" : "inline";
    }
    return "none";
  }

  if (!parent.isEmpty && width < 1) {
    return "none";
  }

  return "inline";
};
