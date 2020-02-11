import { RadialNode, RadialText } from "../../../../types";
import formattedText from "./formatted-text";

interface StoredFormats {
  [route: string]: RadialText;
}

interface StoredPathFormats {
  [path: string]: StoredFormats;
}

const storedFormats: StoredPathFormats = {};

type Props = {
  path: string;
  display: string;
  node: RadialNode;
  name: string;
  containerWidth: number;
  containerHeight: number;
};

const getSizedText = ({ path, display, node, name, containerWidth, containerHeight }: Props): RadialText => {
  if (storedFormats[path] === undefined) {
    storedFormats[path] = {};
  }

  let lines: (JSX.Element | JSX.Element[])[] = [];
  let maxFontSize = 0;
  let fontSize = 0;
  let offsets: number[] = [];

  for (let currentFontSize = 18; currentFontSize > 5; currentFontSize -= 1) {
    const { lines: l, fontSize: f, offsets: o } = formattedText({
      currentFontSize,
      display,
      name,
      containerWidth,
      containerHeight,
    });

    if (f >= fontSize || (f >= maxFontSize - 1 && l.length < lines.length)) {
      lines = l;
      fontSize = f;
      offsets = o;
      maxFontSize = Math.max(maxFontSize, fontSize);
    }
  }

  storedFormats[path][node.route] = { lines, fontSize, offsets };
  return { lines, fontSize, offsets };
};

export default getSizedText;
