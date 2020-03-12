import { RadialText } from "../../../types";
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
  name: string;
  route: string;
  width: number;
  height: number;
};

const getSizedText = ({ path, display, name, route, width, height }: Props): RadialText => {
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
      width,
      height,
    });

    if (f >= fontSize || (f >= maxFontSize - 1 && l.length < lines.length)) {
      lines = l;
      fontSize = f;
      offsets = o;
      maxFontSize = Math.max(maxFontSize, fontSize);
    }
  }

  storedFormats[path][route] = { lines, fontSize, offsets };
  return { lines, fontSize, offsets };
};

export default getSizedText;
