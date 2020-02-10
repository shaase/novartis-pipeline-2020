import React from "react";
import { cleaned, simpleReplace } from "./utils";

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
let measure: (text: string) => TextMetrics;

if (context !== null) {
  context.font = "12px sans-serif";
  const { measureText } = context;
  measure = measureText.bind(context);
}

const spacer = <tspan fillOpacity="0">|</tspan>;

type Props = {
  title: string;
  path: string;
  color: string;
  containerWidth: number;
};

const BubbleLabel: React.FC<Props> = ({ title, path, color, containerWidth }: Props) => {
  const words = title
    .replace(/\(.*?\)\s?/g, "")
    .split(/\s+/)
    .filter((wrd: string) => wrd !== "");
  let line: JSX.Element[] = [];
  let lines: JSX.Element[][] = [];

  const arr = path.split("/");
  const root = arr[1];
  const level = arr.length - 1;
  let fontSize = 18;
  if (context !== null) context.font = `${fontSize}px sans-serif bold`;

  words.forEach((word: string) => {
    const { width: wordWidth } = measure(cleaned(word));
    if (wordWidth > containerWidth) {
      fontSize *= containerWidth / wordWidth;
      if (context !== null) context.font = `${fontSize}px sans-serif bold`;
    }
  });

  words.forEach((word, wordIndex) => {
    const { width } = measure(`${line.join(" ")} ${cleaned(word)}`);
    const formatted = simpleReplace(word, root, level);

    const tSpan = (
      <tspan key={word}>
        {/* TODO: replace danger */}
        {/* eslint-disable-next-line */}
        <tspan dangerouslySetInnerHTML={{ __html: formatted }} />
        {spacer}
      </tspan>
    );

    if (wordIndex < words.length - 1) {
      if (width < containerWidth) {
        line = [...line, tSpan];
      } else {
        lines = line.length === 0 ? [...lines] : [...lines, line];
        line = [tSpan];
      }
    } else if (width < containerWidth) {
      line = [...line, tSpan];
      lines = [...lines, line];
    } else {
      lines = [...lines, line, [tSpan]];
    }
  });

  let dy = [2];
  if (lines.length === 2) {
    dy = [0, fontSize];
  } else if (lines.length === 3) {
    dy = [-fontSize * 0.5, fontSize * 0.5, fontSize * 1.5];
  } else if (lines.length === 4) {
    dy = [-fontSize, 0, fontSize, fontSize * 2];
  } else if (lines.length === 5) {
    dy = [-fontSize * 2, -fontSize, 0, fontSize, fontSize * 2];
  }
  return (
    <g>
      {React.Children.toArray(
        lines.map((textLine, textIndex) => (
          <text fill={color} dx={2} dy={dy[textIndex]} fontSize={fontSize}>
            {textLine}
          </text>
        )),
      )}
    </g>
  );
};

export default BubbleLabel;
