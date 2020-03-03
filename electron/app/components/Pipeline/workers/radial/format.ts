import { RadialNode } from "../../types";
import { itemsForPath } from "../../utils";

const flattenToSubtypes = (list: RadialNode[]): RadialNode[] =>
  list.reduce(
    (a: RadialNode[], b: RadialNode) =>
      a.concat(
        (b.children || [])[0].depth === 6
          ? (b.children || []).filter((child: RadialNode) => child.name !== "*")
          : flattenToSubtypes(b.children || []),
      ),
    [],
  );

export const getFixedNode = (n: RadialNode, path: string): RadialNode => {
  let node: RadialNode = n;
  const { parent, phase, isEmpty, depth, route } = node;
  const { root: pathRoot } = itemsForPath(path);

  if (phase !== undefined) {
    const dist = (node.y1 || 0) - (node.y0 || 0);
    let length = dist;
    if (phase === 1) {
      // opacity = 0.3;
      length *= 0.24;
    } else if (phase === 1.5) {
      // opacity = 0.45;
      length *= 0.475;
    } else if (phase === 2) {
      // opacity = 0.65;
      length *= 0.75;
    } else if (phase === 3) {
      // opacity = 0.8;
    }

    const y1 = (node.y0 || 0) + length;
    node = { ...node, y1 };
  } else if (parent !== null) {
    if (isEmpty) {
      node = { ...node, y0: 0, y1: 0 };
    } else if (parent.isEmpty) {
      let { y0 } = parent;

      if ((route.includes("Malignant/B-cell") || route.includes("Malignant/Blastic")) && depth === 7) {
        ({ y0 } = parent.parent.parent);
      }

      node = { ...node, y0 };
    }
  }

  // let textOpacity = 1;

  if (pathRoot === "Compounds" && node.isStudyContainer && depth === 5) {
    const flattened = flattenToSubtypes(parent.children || []);
    if (flattened.length === 0) {
      const { y1 } = (node.children || [])[0];
      node = { ...node, y1 };
    }
  } else if (pathRoot === "Compounds" && node.isStudyContainer && depth === 6) {
    const flattened = flattenToSubtypes(parent.parent.children || []);
    if (flattened.length === 0) {
      node = { ...node, y0: node.y1 };
    }
    // textOpacity = 0.8;
  }

  return node;
};
