import { RadialNode } from "../../../../types";
import { itemsForPath, slicePath } from "../../../../utils";

export const textDisplay = (node: RadialNode, path: string, length: number, width: number): string => {
  const { route, name = "", parent, depth = 0, isStudyContainer } = node;
  const { root, level } = itemsForPath(path);
  const trunc = root === "Tumors" ? slicePath(path, 6) : path;
  const isStudy = parent !== null ? parent.isStudyContainer : false;

  // hide if node is not within path
  if (route === undefined || !(route.includes(trunc) || trunc.includes(route))) return "none";

  // hide if node has empty or * name
  if (name === "" || name === "*") return "none";

  // hide this node name specifically
  if (name === "Severe Aplastic Anemia") return "none";

  // hide if node is study
  if (isStudy && ((root === "Tumors" && depth > 7) || (root === "Compounds" && depth > 6))) return "none";

  // hide all child labels when viewing root of Compounds
  if (root === "Compounds" && level < 2 && depth > 2) return "none";

  // hide if arc length is short
  if (length < 25) return "none";

  if (!parent.isEmpty && width < 1) return "none";

  // hide if arc width and length are small overall with a name of any real length
  if (width < 50 && length < 30 && name.length > 8) return "none";

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

  if (width > 60 && length > 170) return "curved";

  // if node represents a compound
  if (isStudyContainer || root === "Compounds") {
    // if a decent width
    if (width > 20) {
      // curved or inline based on size
      return length + 10 > width && length > 70 ? "curved" : "inline";
    }

    // hide if no width
    return "none";
  }

  return "inline";
};
