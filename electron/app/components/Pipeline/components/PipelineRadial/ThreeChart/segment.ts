import * as THREE from "three";
import svgMesh3d from "svg-mesh-3d";
import CreateGeom from "three-simplicial-complex";
import { itemsForPath } from "../../../utils";
// import { lightenColor } from "./utils";
import { RadialNode, RadialArc } from "../../../types";
// import WrappedLabel from "./WrappedLabel";

const SvgGeom = CreateGeom(THREE);

const hexdec = (hexString: string): number => {
  const str = `${hexString}`.replace(/[^\da-f]/gi, "");
  return parseInt(str, 16);
};

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

// eslint-disable-next-line
const getSunburstSegment: any = (
  original: RadialNode,
  path: string,
  nct: string,
  getArc: (node: RadialArc) => void,
  // labelCurve,
  // labelTransform,
  // labelAnchor,
  // getDisplay,
  // getTextDisplay: (node: RadialNode) => string,
  // getArcLength,
  // getArcWidth,
  // onSelect,
) => {
  const { root: pathRoot } = itemsForPath(path);
  // const lengthRef = 0;
  if (original.x0 === undefined) return null;

  let node: RadialNode = original;
  const { parent, phase, isEmpty, depth, route } = node;

  // const textDisplay = getTextDisplay(node);
  // let opacity = 1;
  // let lighten = nct !== "";

  // if (nct !== "" && node.isStudyContainer) {
  //   const filtered =
  //     node.children === undefined ? [] : node.children.filter((child: RadialNode) => child.label === nct);

  //   lighten = filtered.length === 0;
  // }

  // if (pathRoot === "Compounds") {
  //   lighten = false;
  // }

  if (phase !== undefined) {
    const dist = (node.y1 || 0) - (node.y0 || 0);
    if (nct !== "") {
      const filtered = (node.parent.children || []).filter((child: RadialNode) => child.label === nct);

      // if (pathRoot !== "Compounds") {
      //   lighten = filtered.length === 0;
      // }
    }

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

  // const arcLength = getArcLength(node);
  // const arcWidth = getArcWidth(node);
  // const isCurved = textDisplay.includes("curved");
  // const containerWidth = isCurved ? arcLength - 6 : arcWidth - 7;
  // const containerHeight = isCurved ? arcWidth : arcLength;

  const nodeArc: RadialArc = {
    x0: node.x0 || 0,
    x1: node.x1 || 0,
    y0: node.y0 || 0,
    y1: node.y1 || 0,
  };

  // console.log(getArc(nodeArc));
  // console.log("");
  // console.log(LUNG);

  const svgPath = getArc(nodeArc);
  const meshData = svgMesh3d(svgPath);
  const geo = new SvgGeom(meshData);
  const mat = new THREE.MeshBasicMaterial({ color: hexdec(node.color), side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  return mesh;
};

export default getSunburstSegment;
