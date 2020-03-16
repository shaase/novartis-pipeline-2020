import { RadialNode, FormattedText } from "../../types";
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

const getRGBArray = (index: number): number[] => {
  const i = index + 1;
  const i0 = i % 255;
  const i1 = Math.floor(i / 255);
  return [i0, i1, 0];
};

export const getFixedNode = (n: RadialNode, index: number, path: string): RadialNode => {
  let node: RadialNode = n;
  const { parent, phase, isEmpty, depth, route } = node;
  const { root: pathRoot } = itemsForPath(path);
  let opacity = 1;
  node.rgbArray = getRGBArray(index);

  if (phase !== undefined) {
    const dist = (node.y1 || 0) - (node.y0 || 0);
    let length = dist;
    if (phase === 1) {
      opacity = 0.3;
      length *= 0.24;
    } else if (phase === 1.5) {
      opacity = 0.45;
      length *= 0.475;
    } else if (phase === 2) {
      opacity = 0.65;
      length *= 0.75;
    } else if (phase === 3) {
      opacity = 0.8;
    }

    node = { ...node, opacity };

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

  let textOpacity = 1;

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
    textOpacity = 0.8;
  }

  node.textOpacity = textOpacity;

  // Formatted Name
  const formattedName: FormattedText[] = [];
  let text = "";
  let bold = false;
  let italics = false;
  let superscript = false;

  if (!node.name.includes("<")) {
    formattedName.push({ text: node.name, bold: false, italics: false, superscript: false });
  } else {
    node.name.split(/(?=[\s()<])/g).forEach((word: string) => {
      const stripped = word.replace(/(<([^>]+)>)/gi, "").replace(/\s/g, "");
      if (word.includes("<b>") || word.includes("<i>") || word.includes("<sup>")) {
        if (text.length > 0) {
          formattedName.push({ text, bold, italics, superscript });
          text = "";
        }
        text += stripped;
        bold = word.includes("<b>") ? true : bold;
        italics = word.includes("<i>") ? true : italics;
        superscript = word.includes("<sup>") ? true : superscript;
      } else if (word.includes("</b>") || word.includes("</i>") || word.includes("</sup>")) {
        text += stripped;
        formattedName.push({ text, bold, italics, superscript });
        bold = word.includes("</b>") ? false : bold;
        italics = word.includes("</i>") ? false : italics;
        superscript = word.includes("</sup>") ? false : superscript;
        text = "";
      } else {
        let spaced = stripped;
        if (stripped === "+") spaced = ` ${stripped} `;
        if (stripped.includes("(")) spaced = ` ${stripped}`;
        text += spaced;
      }
    });

    if (text.length > 0) {
      formattedName.push({ text, bold, italics, superscript });
    }
  }

  node.formattedName = formattedName;

  return node;
};
