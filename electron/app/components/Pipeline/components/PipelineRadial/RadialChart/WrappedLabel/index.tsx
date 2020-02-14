import React from "react";
import { animated } from "react-spring/renderprops";
import { RadialNode } from "../../../../types";
import sizedText from "./sized-text";

type Props = {
  path: string;
  display: string;
  node: RadialNode;
  name: string;
  t: any; // eslint-disable-line
  index: number;
  opacity: number;
  containerWidth: number;
  containerHeight: number;
  labelCurve: (node: RadialNode, index: number, length: number, fontSize: number) => string;
  labelTransform: (node: RadialNode, index: number, length: number, fontSize: number) => string;
  labelAnchor: (node: RadialNode, lines: number) => string;
};

const WrappedLabel: React.FC<Props> = ({
  path,
  display,
  node,
  name,
  t,
  index,
  opacity,
  containerWidth,
  containerHeight,
  labelCurve,
  labelTransform,
  labelAnchor,
}: Props) => {
  const { color } = node;
  console.log(color);
  const { lines, fontSize, offsets } = sizedText({
    path,
    display,
    node,
    name,
    containerWidth,
    containerHeight,
  });

  return (
    <g>
      {(display === "curved" || display === "curved-capped") && (
        <g>
          {React.Children.toArray(
            lines.map((textLine, textIndex) => (
              <animated.path
                id={`curve-${index}-${textIndex}`}
                fill="none"
                d={t.interpolate(() => labelCurve(node, textIndex, lines.length, fontSize))}
              />
            )),
          )}

          <animated.text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={fontSize}
            fill={color}
            opacity={opacity}
          >
            {React.Children.toArray(
              lines.map((textLine, textIndex) => (
                <textPath xlinkHref={`#curve-${index}-${textIndex}`} startOffset="50%">
                  {textLine}
                </textPath>
              )),
            )}
          </animated.text>
        </g>
      )}

      {display === "inline" && (
        <g>
          {React.Children.toArray(
            lines.map((textLine, textIndex) => (
              <animated.text
                textAnchor={labelAnchor(node, lines.length)}
                dominantBaseline="central"
                fontSize={fontSize}
                dy={offsets[textIndex]}
                fill={color}
                opacity={opacity}
                transform={t.interpolate(() => labelTransform(node, textIndex, lines.length, fontSize))}
              >
                {textLine}
              </animated.text>
            )),
          )}
        </g>
      )}
    </g>
  );
};

export default WrappedLabel;
