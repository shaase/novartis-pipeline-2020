import React from "react";
import { NodeLabel, NodeLabelLine } from "../../../types";

type Props = { label: NodeLabel };

const WrappedLabel: React.FC<Props> = ({ label }: Props) => {
  const { display, color, opacity, lines, fontSize, offsets } = label;

  return (
    <g>
      {(display === "curved" || display === "curved-capped") && (
        <g>
          {React.Children.toArray(
            lines.map((labelLine: NodeLabelLine) => (
              <path id={`curve-${labelLine.id}`} fill="none" d={labelLine.curve} />
            )),
          )}

          <text textAnchor="middle" dominantBaseline="central" fontSize={fontSize} fill={color} opacity={opacity}>
            {React.Children.toArray(
              lines.map((labelLine: NodeLabelLine) => (
                <textPath xlinkHref={`#curve-${labelLine.id}`} startOffset="50%">
                  {labelLine.elements}
                </textPath>
              )),
            )}
          </text>
        </g>
      )}

      {display === "inline" && (
        <g>
          {React.Children.toArray(
            lines.map((labelLine: NodeLabelLine, index: number) => (
              <text
                textAnchor={labelLine.anchor}
                dominantBaseline="central"
                fontSize={fontSize}
                dy={offsets[index]}
                fill={color}
                opacity={opacity}
                transform={labelLine.transform}
              >
                {labelLine.elements}
              </text>
            )),
          )}
        </g>
      )}
    </g>
  );
};

export default WrappedLabel;
