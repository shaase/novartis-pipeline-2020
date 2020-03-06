import React from "react";
import { RadialText } from "../../../types";
import { replaceMarkup, simpleReplace, removeMarkup } from "./utils";

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
let measure: (text: string) => TextMetrics;

if (context !== null) {
  context.font = "12px sans-serif";
  const { measureText } = context;
  measure = measureText.bind(context);
}

type Props = {
  currentFontSize: number;
  display: string;
  name: string;
  width: number;
  height: number;
};

const spacerSpan = <tspan fillOpacity="0">|</tspan>;
const plusSpan = <tspan fontStyle="normal">+{spacerSpan}</tspan>;
const slashSpan = <tspan>/{spacerSpan}</tspan>;

const FormattedText = ({ currentFontSize, display, name, width, height }: Props): RadialText => {
  let nodeName = name;

  if (display === "inline" && name === "Non-Hodgkin's Lymphoma") {
    nodeName = "NHL";
  }

  const words = nodeName.split(/\s+/);
  nodeName = simpleReplace(nodeName);
  nodeName = display === "curved-capped" ? nodeName.toUpperCase() : nodeName;

  let lines: (JSX.Element | JSX.Element[])[] = [];
  let fontSize = currentFontSize;
  let weight = "normal";
  let italics = "normal";
  if (context !== null) context.font = `${fontSize}px sans-serif`;
  let { width: maxWidth } = measure(nodeName);

  const shouldLineBreak = height > 30 || display === "inline";

  if (!shouldLineBreak) {
    // TODO: remove danger
    lines.push(<tspan dangerouslySetInnerHTML={{ __html: nodeName }} />); // eslint-disable-line
  } else {
    maxWidth = 0;
    const tSpans = words.map((wrd, wordIndex) => {
      const prev = words[wordIndex - 1] || "";
      const next = words[wordIndex + 1] || "";
      const addPlus = prev === "+";
      const addSlash = next === "/";
      const formatted = replaceMarkup(wrd);

      weight = wrd.includes("<b>") ? "bold" : weight;
      weight = prev.includes("</b>") ? "normal" : weight;
      italics = wrd.includes("<i>") ? "italic" : italics;
      italics = prev.includes("</i>") ? "normal" : italics;

      return (
        <tspan key={wrd}>
          {addPlus && plusSpan}
          <tspan fontWeight={weight} fontStyle={italics}>
            {wrd.includes("+") && plusSpan}
            {/* TODO: remove danger */}
            {/* eslint-disable-next-line */}
            <tspan dangerouslySetInnerHTML={{ __html: formatted }} />
            {spacerSpan}
          </tspan>
          {addSlash && slashSpan}
        </tspan>
      );
    });

    let line: string[] = [];
    let span: JSX.Element[] = [];

    for (let i = 0; i < words.length; i += 1) {
      const word = words[i];

      if (word === "+" || word === "/") {
        continue; // eslint-disable-line
      }

      const prevPlus = words[i - 1] === "+" ? "+" : "";
      const nextSlash = words[i + 1] === "/" ? "/" : "";
      const currentLine = `${prevPlus} ${word} ${nextSlash}`;

      const combined = `${line.join(" ")} ${currentLine}`;
      const { width: lineWidth } = measure(removeMarkup(currentLine));
      const { width: combinedWidth } = measure(removeMarkup(combined));

      maxWidth = i === 0 ? lineWidth : maxWidth;

      if (i < words.length - 1) {
        if (combinedWidth < width) {
          line = [...line, word];
          span = [...span, tSpans[i]];
          maxWidth = Math.max(maxWidth, combinedWidth);
        } else {
          lines = span.length > 0 ? [...lines, span] : lines;
          line = [word];
          span = [tSpans[i]];
          maxWidth = Math.max(maxWidth, lineWidth);
        }
      } else if (combinedWidth < width) {
        span = [...span, tSpans[i]];
        lines = [...lines, span];
        maxWidth = Math.max(maxWidth, combinedWidth);
      } else {
        lines = span.length > 0 ? [...lines, span, tSpans[i]] : [...lines, tSpans[i]];
        maxWidth = Math.max(maxWidth, lineWidth);
      }
    }
  }

  if (maxWidth > width) {
    fontSize *= width / maxWidth;
  }

  let mod = 1;
  switch (lines.length) {
    case 2:
      mod = fontSize * 0.11;
      break;
    case 3:
      mod = fontSize * 0.13;
      break;
    case 4:
      mod = fontSize * 0.17;
      break;
    case 5:
      mod = fontSize * 0.08;
      break;
    default:
      mod = 1;
  }
  const h = fontSize * lines.length * mod;
  if (h > height) {
    fontSize *= height / h;
  }

  if (fontSize < 4) {
    lines = [];
  }

  let offsets = [0];
  if (lines.length === 2) {
    offsets = [-fontSize * 0.46, fontSize * 0.42];
  } else if (lines.length === 3) {
    offsets = [-fontSize * 1, 0, fontSize * 1];
  } else if (lines.length === 4) {
    offsets = [-fontSize * 1.52, -fontSize * 0.52, fontSize * 0.52, fontSize * 1.52];
  } else if (lines.length === 5) {
    offsets = [-fontSize * 1.8, -fontSize * 0.9, 0, fontSize * 0.9, fontSize * 1.8];
  } else if (lines.length === 6) {
    offsets = [-fontSize * 2.52, -fontSize * 1.52, -fontSize * 0.52, fontSize * 0.52, fontSize * 1.52, fontSize * 2.52];
  }

  return { lines, fontSize, offsets };
};

export default FormattedText;
